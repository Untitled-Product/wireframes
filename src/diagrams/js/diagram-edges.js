/**
 * Diagram Edges - Edge/connection drawing utilities
 * Handles different edge types and routing algorithms
 */

class DiagramEdges {
  constructor() {
    this.edgeTypes = {
      flow: {
        stroke: '#6b7280',
        strokeWidth: 2,
        dashArray: null,
        arrowhead: 'arrowhead'
      },
      conditional: {
        stroke: '#9ca3af',
        strokeWidth: 2,
        dashArray: '8,4',
        arrowhead: 'arrowhead'
      },
      data: {
        stroke: '#3b82f6',
        strokeWidth: 3,
        dashArray: null,
        arrowhead: 'arrowhead-data'
      },
      async: {
        stroke: '#8b5cf6',
        strokeWidth: 2,
        dashArray: '4,4',
        arrowhead: 'arrowhead'
      },
      error: {
        stroke: '#ef4444',
        strokeWidth: 2.5,
        dashArray: null,
        arrowhead: 'arrowhead-error'
      },
      association: {
        stroke: '#374151',
        strokeWidth: 2,
        dashArray: null,
        arrowhead: null
      },
      dependency: {
        stroke: '#6b7280',
        strokeWidth: 2,
        dashArray: '6,3',
        arrowhead: 'arrowhead'
      }
    };

    // ER relationship types
    this.relationshipTypes = {
      'one-to-one': { sourceSymbol: '|', targetSymbol: '|' },
      'one-to-many': { sourceSymbol: '|', targetSymbol: '<' },
      'many-to-one': { sourceSymbol: '<', targetSymbol: '|' },
      'many-to-many': { sourceSymbol: '<', targetSymbol: '<' }
    };
  }

  /**
   * Get edge type configuration
   */
  getType(typeName) {
    return this.edgeTypes[typeName] || this.edgeTypes.flow;
  }

  /**
   * Create SVG path for edge
   */
  createPath(edge, sourcePos, targetPos, options = {}) {
    const type = this.getType(edge.type);
    const pathData = this.calculatePath(sourcePos, targetPos, options);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.setAttribute('class', `wf-diagram-edge wf-diagram-edge--${edge.type || 'flow'}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', type.stroke);
    path.setAttribute('stroke-width', type.strokeWidth);

    if (type.dashArray) {
      path.setAttribute('stroke-dasharray', type.dashArray);
    }

    if (type.arrowhead) {
      path.setAttribute('marker-end', `url(#${type.arrowhead})`);
    }

    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('stroke-linejoin', 'round');

    return path;
  }

  /**
   * Calculate path data string
   */
  calculatePath(source, target, options = {}) {
    const { routing = 'smooth' } = options;

    switch (routing) {
      case 'straight':
        return this.straightPath(source, target);
      case 'orthogonal':
        return this.orthogonalPath(source, target);
      case 'curved':
        return this.curvedPath(source, target);
      case 'smooth':
      default:
        return this.smoothPath(source, target);
    }
  }

  /**
   * Straight line path
   */
  straightPath(source, target) {
    return `M ${source.x} ${source.y} L ${target.x} ${target.y}`;
  }

  /**
   * Smooth bezier curve path
   */
  smoothPath(source, target) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;

    // Calculate control point offset based on distance
    const dist = Math.sqrt(dx * dx + dy * dy);
    const offset = Math.min(dist * 0.3, 100);

    // Determine curve direction based on relative positions
    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal dominant - S-curve
      const midX = source.x + dx / 2;
      return `M ${source.x} ${source.y}
              C ${midX} ${source.y}, ${midX} ${target.y}, ${target.x} ${target.y}`;
    } else {
      // Vertical dominant - S-curve
      const midY = source.y + dy / 2;
      return `M ${source.x} ${source.y}
              C ${source.x} ${midY}, ${target.x} ${midY}, ${target.x} ${target.y}`;
    }
  }

  /**
   * Curved quadratic bezier path
   */
  curvedPath(source, target) {
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;

    // Add curve by offsetting the midpoint
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const curveOffset = 30;

    // Perpendicular offset for curve
    const length = Math.sqrt(dx * dx + dy * dy);
    const offsetX = -dy / length * curveOffset;
    const offsetY = dx / length * curveOffset;

    const controlX = midX + offsetX;
    const controlY = midY + offsetY;

    return `M ${source.x} ${source.y}
            Q ${controlX} ${controlY}, ${target.x} ${target.y}`;
  }

  /**
   * Orthogonal (right-angle) path
   */
  orthogonalPath(source, target) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;

    // Determine routing direction
    if (Math.abs(dx) > Math.abs(dy)) {
      // Go horizontal first, then vertical
      const midX = source.x + dx / 2;
      return `M ${source.x} ${source.y}
              L ${midX} ${source.y}
              L ${midX} ${target.y}
              L ${target.x} ${target.y}`;
    } else {
      // Go vertical first, then horizontal
      const midY = source.y + dy / 2;
      return `M ${source.x} ${source.y}
              L ${source.x} ${midY}
              L ${target.x} ${midY}
              L ${target.x} ${target.y}`;
    }
  }

  /**
   * Create edge with label
   */
  createLabeledEdge(edge, sourcePos, targetPos, options = {}) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'wf-diagram-edge-group');
    g.setAttribute('data-edge-id', edge.id);

    // Create path
    const path = this.createPath(edge, sourcePos, targetPos, options);
    g.appendChild(path);

    // Create label if exists
    if (edge.label) {
      const labelGroup = this.createLabel(edge.label, sourcePos, targetPos);
      g.appendChild(labelGroup);
    }

    return g;
  }

  /**
   * Create edge label
   */
  createLabel(label, sourcePos, targetPos) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Calculate label position (midpoint)
    const midX = (sourcePos.x + targetPos.x) / 2;
    const midY = (sourcePos.y + targetPos.y) / 2;

    // Label background
    const textWidth = label.length * 8 + 16;
    const textHeight = 24;

    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('x', midX - textWidth / 2);
    bg.setAttribute('y', midY - textHeight / 2);
    bg.setAttribute('width', textWidth);
    bg.setAttribute('height', textHeight);
    bg.setAttribute('rx', '4');
    bg.setAttribute('class', 'wf-diagram-edge-label-bg');
    bg.setAttribute('fill', '#ffffff');
    bg.setAttribute('stroke', '#e5e7eb');
    g.appendChild(bg);

    // Label text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', midX);
    text.setAttribute('y', midY + 4);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('class', 'wf-diagram-edge-label');
    text.setAttribute('font-family', 'Indie Flower, cursive');
    text.setAttribute('font-size', '14');
    text.setAttribute('fill', '#374151');
    text.textContent = label;
    g.appendChild(text);

    return g;
  }

  /**
   * Create ER relationship line with cardinality symbols
   */
  createRelationship(edge, sourcePos, targetPos, relationType) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'wf-diagram-relationship');

    // Main line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', sourcePos.x);
    line.setAttribute('y1', sourcePos.y);
    line.setAttribute('x2', targetPos.x);
    line.setAttribute('y2', targetPos.y);
    line.setAttribute('stroke', '#374151');
    line.setAttribute('stroke-width', '2');
    g.appendChild(line);

    // Add cardinality symbols
    const rel = this.relationshipTypes[relationType] || this.relationshipTypes['one-to-many'];

    // Source symbol
    if (rel.sourceSymbol) {
      const sourceSymbol = this.createCardinalitySymbol(
        rel.sourceSymbol,
        sourcePos,
        targetPos,
        'source'
      );
      g.appendChild(sourceSymbol);
    }

    // Target symbol
    if (rel.targetSymbol) {
      const targetSymbol = this.createCardinalitySymbol(
        rel.targetSymbol,
        sourcePos,
        targetPos,
        'target'
      );
      g.appendChild(targetSymbol);
    }

    // Add label if present
    if (edge.label) {
      const labelGroup = this.createLabel(edge.label, sourcePos, targetPos);
      g.appendChild(labelGroup);
    }

    return g;
  }

  /**
   * Create cardinality symbol (|, <, etc.)
   */
  createCardinalitySymbol(symbol, sourcePos, targetPos, position) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Calculate position and angle
    const dx = targetPos.x - sourcePos.x;
    const dy = targetPos.y - sourcePos.y;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Offset from endpoint
    const offset = 20;
    let pos;
    if (position === 'source') {
      pos = {
        x: sourcePos.x + (dx / Math.sqrt(dx*dx + dy*dy)) * offset,
        y: sourcePos.y + (dy / Math.sqrt(dx*dx + dy*dy)) * offset
      };
    } else {
      pos = {
        x: targetPos.x - (dx / Math.sqrt(dx*dx + dy*dy)) * offset,
        y: targetPos.y - (dy / Math.sqrt(dx*dx + dy*dy)) * offset
      };
    }

    g.setAttribute('transform', `translate(${pos.x}, ${pos.y}) rotate(${angle})`);

    if (symbol === '|') {
      // One - single line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', '-8');
      line.setAttribute('x2', '0');
      line.setAttribute('y2', '8');
      line.setAttribute('stroke', '#374151');
      line.setAttribute('stroke-width', '2');
      g.appendChild(line);
    } else if (symbol === '<') {
      // Many - crow's foot
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M 10 -8 L 0 0 L 10 8');
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#374151');
      path.setAttribute('stroke-width', '2');
      g.appendChild(path);
    }

    return g;
  }

  /**
   * Create sequence diagram message line
   */
  createMessage(edge, sourcePos, targetPos, isResponse = false) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'wf-diagram-message');

    // Line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', sourcePos.x);
    line.setAttribute('y1', sourcePos.y);
    line.setAttribute('x2', targetPos.x);
    line.setAttribute('y2', targetPos.y);
    line.setAttribute('stroke', '#374151');
    line.setAttribute('stroke-width', '2');

    if (isResponse) {
      line.setAttribute('stroke-dasharray', '6,3');
    }

    line.setAttribute('marker-end', 'url(#arrowhead)');
    g.appendChild(line);

    // Message label
    if (edge.label) {
      const midX = (sourcePos.x + targetPos.x) / 2;
      const midY = sourcePos.y - 10;

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', midX);
      text.setAttribute('y', midY);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-family', 'Indie Flower, cursive');
      text.setAttribute('font-size', '14');
      text.setAttribute('fill', '#374151');
      text.textContent = edge.label;
      g.appendChild(text);
    }

    return g;
  }

  /**
   * Create self-referencing loop edge
   */
  createSelfLoop(sourcePos, nodeSize) {
    const loopSize = 40;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

    // Start from right side, loop above and return to right side
    const startX = sourcePos.x + nodeSize.width / 2;
    const startY = sourcePos.y;
    const endX = startX;
    const endY = sourcePos.y + 20;

    path.setAttribute('d', `
      M ${startX} ${startY}
      C ${startX + loopSize} ${startY - loopSize},
        ${startX + loopSize} ${endY + loopSize},
        ${endX} ${endY}
    `);

    path.setAttribute('class', 'wf-diagram-edge wf-diagram-edge--flow');
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#6b7280');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('marker-end', 'url(#arrowhead)');

    return path;
  }

  /**
   * Calculate connection point on node boundary
   */
  getConnectionPoint(nodeCenter, targetCenter, nodeSize, nodeType) {
    const dx = targetCenter.x - nodeCenter.x;
    const dy = targetCenter.y - nodeCenter.y;
    const angle = Math.atan2(dy, dx);

    // Circular nodes
    if (nodeType === 'start' || nodeType === 'end') {
      const radius = 30;
      return {
        x: nodeCenter.x + Math.cos(angle) * radius,
        y: nodeCenter.y + Math.sin(angle) * radius
      };
    }

    // Diamond nodes
    if (nodeType === 'decision') {
      const halfSize = 50;
      if (Math.abs(dx) > Math.abs(dy)) {
        return {
          x: nodeCenter.x + (dx > 0 ? halfSize : -halfSize),
          y: nodeCenter.y
        };
      } else {
        return {
          x: nodeCenter.x,
          y: nodeCenter.y + (dy > 0 ? halfSize : -halfSize)
        };
      }
    }

    // Rectangle nodes
    const halfWidth = nodeSize.width / 2;
    const halfHeight = nodeSize.height / 2;

    if (Math.abs(dx) * halfHeight > Math.abs(dy) * halfWidth) {
      return {
        x: nodeCenter.x + (dx > 0 ? halfWidth : -halfWidth),
        y: nodeCenter.y + (dy / Math.abs(dx)) * halfWidth * (dx > 0 ? 1 : -1)
      };
    } else {
      return {
        x: nodeCenter.x + (dx / Math.abs(dy)) * halfHeight * (dy > 0 ? 1 : -1),
        y: nodeCenter.y + (dy > 0 ? halfHeight : -halfHeight)
      };
    }
  }
}

// Export
window.DiagramEdges = DiagramEdges;
