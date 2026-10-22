/* Compact entity diagrams. Labels and field roles come only from detail.er. */
(() => {
  'use strict';
  let sequence = 0;
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
  const keyOf = value => String(value).replace(/\s*[（(](?:可空|nullable)[)）]/gi, '').trim();
  const textWidth = (value, size) => [...String(value)].reduce((width, character) => width + (character.charCodeAt(0) > 255 ? size : size * 0.62), 0);

  function graphFor(rows, logical) {
    const nodes = new Map();
    const nodeFor = name => {
      if (!nodes.has(name)) nodes.set(name, { name, fields: new Map(), incoming: [], outgoing: [], rank: 0 });
      return nodes.get(name);
    };
    const fieldFor = (node, value, role) => {
      const key = keyOf(value);
      if (!node.fields.has(key)) node.fields.set(key, { key, labels: new Set(), roles: new Set() });
      const field = node.fields.get(key);
      field.labels.add(value);
      field.nullable ||= /[（(](?:可空|nullable)[)）]/i.test(value);
      if (!logical) field.roles.add(role);
      return key;
    };
    const edges = rows.map((row, index) => {
      const [parentName, parentField, childName, childField, label] = row.map(value => String(value ?? ''));
      const parent = nodeFor(parentName), child = nodeFor(childName);
      const edge = { number: index + 1, parent, child, parentField, childField, label };
      edge.parentKey = fieldFor(parent, parentField, 'PK');
      edge.childKey = fieldFor(child, childField, 'FK');
      parent.outgoing.push(edge); child.incoming.push(edge);
      return edge;
    });
    const remaining = new Set(nodes.values()), components = [];
    while (remaining.size) {
      const queue = [remaining.values().next().value], group = [];
      remaining.delete(queue[0]);
      for (let index = 0; index < queue.length; index++) {
        const node = queue[index]; group.push(node);
        [...node.incoming, ...node.outgoing].forEach(edge => {
          const other = edge.parent === node ? edge.child : edge.parent;
          if (remaining.delete(other)) queue.push(other);
        });
      }
      const members = new Set(group);
      components.push({ nodes: group, edges: edges.filter(edge => members.has(edge.parent)) });
    }
    return { nodes, edges, components };
  }

  function layout(component) {
    // Kahn ordering gives each entity one position, including nodes shared by two parents.
    const indegree = new Map(component.nodes.map(node => [node, node.incoming.length]));
    const queue = component.nodes.filter(node => indegree.get(node) === 0), visited = new Set();
    for (let index = 0; index < queue.length; index++) {
      const node = queue[index]; visited.add(node);
      node.outgoing.forEach(edge => {
        edge.child.rank = Math.max(edge.child.rank, node.rank + 1);
        indegree.set(edge.child, indegree.get(edge.child) - 1);
        if (indegree.get(edge.child) === 0) queue.push(edge.child);
      });
    }
    // The reviewed diagrams are acyclic. Keep unexpected cycles readable without dropping edges.
    component.nodes.filter(node => !visited.has(node)).forEach((node, index) => { node.rank = index; });
    const levels = [];
    component.nodes.forEach(node => {
      (levels[node.rank] ||= []).push(node);
      node.width = Math.ceil(Math.max(216, textWidth(node.name, 15) + 28, ...[...node.fields.values()].map(field => textWidth(field.key + (field.nullable ? ' ?' : ''), 14) + 82)));
      node.height = 48 + node.fields.size * 28;
    });
    const vertical = levels.length > 3;
    const padding = 24, gap = vertical ? 48 : 62, siblingGap = 28;
    const maxBreadth = Math.max(...levels.map(level => level.reduce((sum, node) => sum + (vertical ? node.width : node.height), 0) + (level.length - 1) * siblingGap));
    let depth = padding;
    levels.forEach(level => {
      // Stable parent barycentres keep branches in roughly the same visual lane.
      level.sort((a, b) => {
        const center = node => node.incoming.length ? node.incoming.reduce((sum, edge) => sum + (vertical ? edge.parent.x || 0 : edge.parent.y || 0), 0) / node.incoming.length : component.nodes.indexOf(node);
        return center(a) - center(b);
      });
      const breadth = level.reduce((sum, node) => sum + (vertical ? node.width : node.height), 0) + (level.length - 1) * siblingGap;
      let cross = padding + (maxBreadth - breadth) / 2;
      level.forEach(node => {
        node.x = vertical ? cross : depth;
        node.y = vertical ? depth : cross;
        cross += (vertical ? node.width : node.height) + siblingGap;
      });
      depth += Math.max(...level.map(node => vertical ? node.height : node.width)) + gap;
    });
    const skips = component.edges.filter(edge => edge.child.rank !== edge.parent.rank + 1);
    const width = vertical ? maxBreadth + padding * 2 + skips.length * 26 : depth - gap + padding;
    const height = vertical ? depth - gap + padding : maxBreadth + padding * 2 + skips.length * 26;
    return { vertical, width, height, skips, padding };
  }

  function fieldY(node, key) {
    return node.y + 56 + [...node.fields.keys()].indexOf(key) * 28;
  }

  function edgeGeometry(edge, metrics) {
    const { parent, child } = edge;
    const skipIndex = metrics.skips.indexOf(edge);
    if (metrics.vertical) {
      const outgoingIndex = parent.outgoing.indexOf(edge), incomingIndex = child.incoming.indexOf(edge);
      const x1 = parent.x + parent.width * (outgoingIndex + 1) / (parent.outgoing.length + 1), y1 = parent.y + parent.height;
      const x2 = child.x + child.width * (incomingIndex + 1) / (child.incoming.length + 1), y2 = child.y;
      if (skipIndex >= 0) {
        const route = metrics.width - metrics.padding - skipIndex * 26;
        return { path: `M${x1},${y1} V${y1 + 23} H${route} V${y2 - 23} H${x2} V${y2}`, x: route, y: (y1 + y2) / 2 };
      }
      const middle = (y1 + y2) / 2;
      return { path: `M${x1},${y1} C${x1},${middle} ${x2},${middle} ${x2},${y2}`, x: (x1 + x2) / 2, y: middle };
    }
    const x1 = parent.x + parent.width, y1 = fieldY(parent, edge.parentKey);
    const x2 = child.x, y2 = fieldY(child, edge.childKey);
    if (skipIndex >= 0) {
      const route = metrics.height - metrics.padding - skipIndex * 26;
      return { path: `M${x1},${y1} H${x1 + 25} V${route} H${x2 - 25} V${y2} H${x2}`, x: (x1 + x2) / 2, y: route };
    }
    const middle = (x1 + x2) / 2;
    return { path: `M${x1},${y1} C${middle},${y1} ${middle},${y2} ${x2},${y2}`, x: middle, y: (y1 + y2) / 2 };
  }

  function nodeSVG(node, logical, en) {
    const fields = [...node.fields.values()].map((field, index) => {
      const y = 56 + index * 28;
      const role = logical ? (en ? 'ID' : '标识') : [...field.roles].join('/');
      const label = field.key + (field.nullable ? ' ?' : '');
      return `<g class="engineering-er-field" data-field="${escape(field.key)}"><title>${escape([...field.labels].join(' / '))}</title><text x="14" y="${y}" fill="var(--muted-strong, #626b65)" style="font-size:13px;font-weight:600">${escape(role)}</text><text x="65" y="${y}" fill="var(--text, #263c3b)" style="font-size:14px">${escape(label)}</text></g>`;
    }).join('');
    return `<g class="engineering-er-node" data-entity="${escape(node.name)}" transform="translate(${node.x},${node.y})"><rect width="${node.width}" height="${node.height}" rx="12" fill="var(--surface, #fffdf8)" stroke="var(--line-strong, #b9c5b4)" stroke-width="1.5"/><path d="M0 38 H${node.width}" stroke="var(--line, #dce1d4)"/><text x="14" y="26" fill="var(--text, #263c3b)" style="font-size:15px;font-weight:700">${escape(node.name)}</text>${fields}</g>`;
  }

  function er(detail, en = false) {
    const rows = (detail?.er || []).filter(row => Array.isArray(row) && row.length >= 5 && row[0] && row[2]);
    if (!rows.length) return '';
    const logical = !!detail.logicalER;
    const graph = graphFor(rows, logical);
    const id = `engineering-er-${++sequence}`;
    const title = logical ? (en ? 'Logical data relationships' : '逻辑数据关联') : (en ? 'Entities and foreign-key references' : '实体与外键引用');
    const description = logical
      ? (en ? 'Lines show business identifiers or conceptual associations. They do not establish database keys or cardinalities beyond the relationship descriptions.' : '连线表示业务标识或概念联系，不表示数据库主外键；基数仅以关系说明明确提供的内容为准。')
      : (en ? 'Arrows point from child foreign-key fields to referenced parent primary keys. Nullable notes are retained. These excerpts do not establish a unique child or a mandatory child record.' : '箭头从子表外键指向父表主键，保留可空注记；摘录不证明子表引用列唯一，也不要求父记录已存在子记录。');
    const panels = graph.components.map((component, index) => {
      const metrics = layout(component);
      const marker = `${id}-arrow-${index}`;
      const badges = [];
      const edges = component.edges.map(edge => {
        const geometry = edgeGeometry(edge, metrics);
        badges.push(`<g class="engineering-er-edge-number" aria-hidden="true"><circle cx="${geometry.x}" cy="${geometry.y}" r="12" fill="var(--surface, #fffdf8)" stroke="var(--blue-deep, #4e7192)"/><text x="${geometry.x}" y="${geometry.y + 4.5}" text-anchor="middle" fill="var(--text, #263c3b)" style="font-size:13px;font-weight:700">${edge.number}</text></g>`);
        const reference = logical ? `${edge.parent.name}.${edge.parentField} — ${edge.child.name}.${edge.childField}` : `${edge.child.name}.${edge.childField} → ${edge.parent.name}.${edge.parentField}`;
        return `<g class="engineering-er-edge" data-relation="${edge.number}"><title>${escape(`${edge.number}. ${reference}: ${edge.label}`)}</title><path d="${geometry.path}" fill="none" stroke="var(--blue-deep, #4e7192)" stroke-width="1.65"${logical ? ' stroke-dasharray="6 4"' : ` marker-start="url(#${marker})"`}/></g>`;
      }).join('');
      return `<div class="engineering-er-scroll" tabindex="0" role="region" aria-label="${escape(en ? `${title}, group ${index + 1}; scroll horizontally if needed` : `${title}，第 ${index + 1} 组；可横向滚动`)}" style="overflow-x:auto;max-width:100%"><svg class="engineering-er-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${metrics.width} ${metrics.height}" width="${metrics.width}" height="${metrics.height}" role="img" aria-labelledby="${id}-title-${index} ${id}-desc-${index}" style="display:block;width:${metrics.width}px;min-width:${metrics.width}px;max-width:none;font-family:ui-monospace,SFMono-Regular,Consolas,monospace"><title id="${id}-title-${index}">${escape(title)}</title><desc id="${id}-desc-${index}">${escape(description)} ${component.edges.map(edge => escape(`${edge.number}. ${edge.label}`)).join('; ')}</desc><defs><marker id="${marker}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 1 L9 5 L0 9" fill="none" stroke="var(--blue-deep, #4e7192)" stroke-width="1.7"/></marker></defs>${edges}${component.nodes.map(node => nodeSVG(node, logical, en)).join('')}${badges.join('')}</svg></div>`;
    }).join('');
    const relations = graph.edges.map(edge => `<li value="${edge.number}" data-relation="${edge.number}"><span class="engineering-er-reference"><code>${escape(edge.parent.name)}.${escape(edge.parentField)}</code><span aria-hidden="true"> ${logical ? '—' : '←'} </span><code>${escape(edge.child.name)}.${escape(edge.childField)}</code></span><span class="engineering-er-relationship">${escape(edge.label)}</span></li>`).join('');
    const legend = logical ? (en ? 'ID = an identifier in the relationship description, which may be conceptual; dashed lines = logical or conceptual relationships.' : '标识 = 关系说明中的标识，可能为概念示意；虚线 = 逻辑或概念联系。') : (en ? 'PK = referenced primary key; FK = child reference field; ? = nullable. Each field is shown once per entity.' : 'PK = 被引用主键；FK = 子表引用字段；? = 可空。相同实体和字段合并展示。');
    return `<figure class="diagram-figure engineering-er" data-diagram="er"><div class="diagram-label">${logical ? 'LOGICAL DATA MODEL' : 'ENTITY RELATIONSHIPS'}</div><p class="engineering-er-legend">${escape(legend)}</p>${panels}<figcaption>${escape(description)}</figcaption><ol class="engineering-er-relations" aria-label="${en ? 'Complete relationship descriptions' : '完整关系说明'}">${relations}</ol></figure>`;
  }

  window.YuecongDiagrams = { ...(window.YuecongDiagrams || {}), er };
})();
