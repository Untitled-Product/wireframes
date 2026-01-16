/**
 * Diagram Nodes - Node type definitions and rendering helpers
 * Specialized node renderers for different diagram types
 */

class DiagramNodes {
  constructor() {
    this.nodeTypes = {
      // Basic flow nodes
      start: {
        label: 'Start',
        shape: 'circle',
        color: '#22c55e',
        borderColor: '#16a34a',
        textColor: '#ffffff',
        size: { width: 60, height: 60 }
      },
      end: {
        label: 'End',
        shape: 'circle',
        color: '#ef4444',
        borderColor: '#dc2626',
        textColor: '#ffffff',
        size: { width: 60, height: 60 }
      },
      page: {
        label: 'Page',
        shape: 'page',
        color: 'var(--theme-primary-light, #ccfbf1)',
        borderColor: 'var(--theme-primary-dark, #0d9488)',
        textColor: '#1f2937',
        size: { width: 140, height: 60 }
      },
      decision: {
        label: 'Decision',
        shape: 'diamond',
        color: '#fef3c7',
        borderColor: '#d97706',
        textColor: '#1f2937',
        size: { width: 100, height: 100 }
      },
      action: {
        label: 'Action',
        shape: 'rectangle',
        color: '#e0e7ff',
        borderColor: '#4f46e5',
        textColor: '#1f2937',
        size: { width: 140, height: 50 }
      },

      // Technical nodes
      api: {
        label: 'API',
        shape: 'hexagon',
        color: '#fef3c7',
        borderColor: '#d97706',
        textColor: '#1f2937',
        size: { width: 160, height: 50 }
      },
      database: {
        label: 'Database',
        shape: 'cylinder',
        color: '#dbeafe',
        borderColor: '#2563eb',
        textColor: '#1f2937',
        size: { width: 120, height: 70 }
      },
      service: {
        label: 'Service',
        shape: 'rectangle',
        color: '#f3e8ff',
        borderColor: '#7c3aed',
        textColor: '#1f2937',
        size: { width: 140, height: 60 }
      },
      data: {
        label: 'Data',
        shape: 'parallelogram',
        color: '#e0f2fe',
        borderColor: '#0284c7',
        textColor: '#1f2937',
        size: { width: 140, height: 50 }
      },

      // Entity Relationship nodes
      entity: {
        label: 'Entity',
        shape: 'entity',
        color: '#ffffff',
        borderColor: '#374151',
        textColor: '#1f2937',
        size: { width: 180, height: 100 }
      },

      // State machine nodes
      state: {
        label: 'State',
        shape: 'rounded',
        color: '#ffffff',
        borderColor: '#374151',
        textColor: '#1f2937',
        size: { width: 100, height: 50 }
      },

      // Sequence diagram nodes
      participant: {
        label: 'Participant',
        shape: 'rectangle',
        color: 'var(--theme-primary-light, #ccfbf1)',
        borderColor: 'var(--theme-primary-dark, #0d9488)',
        textColor: '#1f2937',
        size: { width: 120, height: 50 }
      },

      // Swimlane nodes
      swimlane: {
        label: 'Swimlane',
        shape: 'swimlane',
        color: '#f3f4f6',
        borderColor: '#9ca3af',
        textColor: '#1f2937',
        size: { width: 800, height: 150 }
      }
    };
  }

  /**
   * Get node type configuration
   */
  getType(typeName) {
    return this.nodeTypes[typeName] || this.nodeTypes.action;
  }

  /**
   * Get node size
   */
  getSize(typeName) {
    const type = this.getType(typeName);
    return type.size;
  }

  /**
   * Create SVG node element
   */
  createSVGNode(node) {
    const type = this.getType(node.type);
    const pos = node.position || { x: 0, y: 0 };

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', `wf-diagram-node-g wf-diagram-node-g--${node.type}`);
    g.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
    g.setAttribute('data-node-id', node.id);

    // Create shape based on type
    const shape = this.createShape(node.type, type);
    g.appendChild(shape);

    // Add text
    const text = this.createText(node, type);
    g.appendChild(text);

    return g;
  }

  /**
   * Create shape SVG element
   */
  createShape(typeName, typeConfig) {
    const { size, color, borderColor } = typeConfig;

    switch (typeConfig.shape) {
      case 'circle':
        return this.createCircle(size.width / 2, color, borderColor);

      case 'diamond':
        return this.createDiamond(size.width, size.height, color, borderColor);

      case 'hexagon':
        return this.createHexagon(size.width, size.height, color, borderColor);

      case 'cylinder':
        return this.createCylinder(size.width, size.height, color, borderColor);

      case 'parallelogram':
        return this.createParallelogram(size.width, size.height, color, borderColor);

      case 'rounded':
        return this.createRounded(size.width, size.height, color, borderColor);

      case 'page':
        return this.createPage(size.width, size.height, color, borderColor);

      case 'entity':
        return this.createEntity(size.width, size.height, color, borderColor);

      case 'rectangle':
      default:
        return this.createRectangle(size.width, size.height, color, borderColor);
    }
  }

  /**
   * Create rectangle shape
   */
  createRectangle(width, height, fill, stroke) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('rx', '8');
    return rect;
  }

  /**
   * Create rounded rectangle (for states)
   */
  createRounded(width, height, fill, stroke) {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', '3');
    rect.setAttribute('rx', '25');
    return rect;
  }

  /**
   * Create circle shape
   */
  createCircle(radius, fill, stroke) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', radius);
    circle.setAttribute('cy', radius);
    circle.setAttribute('r', radius - 2);
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', '2');
    return circle;
  }

  /**
   * Create diamond shape (for decisions)
   */
  createDiamond(width, height, fill, stroke) {
    const halfW = width / 2;
    const halfH = height / 2;
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', `${halfW},0 ${width},${halfH} ${halfW},${height} 0,${halfH}`);
    polygon.setAttribute('fill', fill);
    polygon.setAttribute('stroke', stroke);
    polygon.setAttribute('stroke-width', '2');
    return polygon;
  }

  /**
   * Create hexagon shape (for API)
   */
  createHexagon(width, height, fill, stroke) {
    const inset = 15;
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points',
      `${inset},0 ${width - inset},0 ${width},${height/2} ${width - inset},${height} ${inset},${height} 0,${height/2}`
    );
    polygon.setAttribute('fill', fill);
    polygon.setAttribute('stroke', stroke);
    polygon.setAttribute('stroke-width', '2');
    return polygon;
  }

  /**
   * Create cylinder shape (for database)
   */
  createCylinder(width, height, fill, stroke) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Body
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', '0');
    rect.setAttribute('y', '10');
    rect.setAttribute('width', width);
    rect.setAttribute('height', height - 20);
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', '2');
    g.appendChild(rect);

    // Top ellipse
    const topEllipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    topEllipse.setAttribute('cx', width / 2);
    topEllipse.setAttribute('cy', '10');
    topEllipse.setAttribute('rx', width / 2);
    topEllipse.setAttribute('ry', '10');
    topEllipse.setAttribute('fill', fill);
    topEllipse.setAttribute('stroke', stroke);
    topEllipse.setAttribute('stroke-width', '2');
    g.appendChild(topEllipse);

    // Bottom ellipse (partial)
    const bottomPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bottomPath.setAttribute('d', `M 0 ${height - 10} Q ${width / 2} ${height + 10} ${width} ${height - 10}`);
    bottomPath.setAttribute('fill', 'none');
    bottomPath.setAttribute('stroke', stroke);
    bottomPath.setAttribute('stroke-width', '2');
    g.appendChild(bottomPath);

    return g;
  }

  /**
   * Create parallelogram shape (for data)
   */
  createParallelogram(width, height, fill, stroke) {
    const skew = 15;
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points',
      `${skew},0 ${width},0 ${width - skew},${height} 0,${height}`
    );
    polygon.setAttribute('fill', fill);
    polygon.setAttribute('stroke', stroke);
    polygon.setAttribute('stroke-width', '2');
    return polygon;
  }

  /**
   * Create page shape (with tab)
   */
  createPage(width, height, fill, stroke) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Tab at top
    const tab = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    tab.setAttribute('x', '10');
    tab.setAttribute('y', '-8');
    tab.setAttribute('width', width - 20);
    tab.setAttribute('height', '10');
    tab.setAttribute('fill', fill);
    tab.setAttribute('stroke', stroke);
    tab.setAttribute('stroke-width', '2');
    tab.setAttribute('rx', '4');
    g.appendChild(tab);

    // Main body
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('rx', '8');
    g.appendChild(rect);

    return g;
  }

  /**
   * Create entity shape (for ER diagrams)
   */
  createEntity(width, height, fill, stroke) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');

    // Main box
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', fill);
    rect.setAttribute('stroke', stroke);
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('rx', '4');
    g.appendChild(rect);

    // Header divider line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '0');
    line.setAttribute('y1', '35');
    line.setAttribute('x2', width);
    line.setAttribute('y2', '35');
    line.setAttribute('stroke', stroke);
    line.setAttribute('stroke-width', '2');
    g.appendChild(line);

    return g;
  }

  /**
   * Create text element for node
   */
  createText(node, typeConfig) {
    const { size, textColor } = typeConfig;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    text.setAttribute('x', size.width / 2);
    text.setAttribute('y', size.height / 2 + 5);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('fill', textColor);
    text.setAttribute('font-family', 'Indie Flower, cursive');
    text.setAttribute('font-size', '16');
    text.textContent = node.label;

    return text;
  }

  /**
   * Create entity node with fields (for ER diagrams)
   */
  createEntityNode(entity) {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const pos = entity.position || { x: 0, y: 0 };
    g.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
    g.setAttribute('data-node-id', entity.id);

    const width = 180;
    const headerHeight = 35;
    const fieldHeight = 25;
    const height = headerHeight + (entity.fields?.length || 0) * fieldHeight + 10;

    // Box
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('fill', '#ffffff');
    rect.setAttribute('stroke', '#374151');
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('rx', '4');
    g.appendChild(rect);

    // Header background
    const headerBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    headerBg.setAttribute('width', width);
    headerBg.setAttribute('height', headerHeight);
    headerBg.setAttribute('fill', 'var(--theme-primary-light, #ccfbf1)');
    headerBg.setAttribute('rx', '4');
    g.appendChild(headerBg);

    // Header line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '0');
    line.setAttribute('y1', headerHeight);
    line.setAttribute('x2', width);
    line.setAttribute('y2', headerHeight);
    line.setAttribute('stroke', '#374151');
    line.setAttribute('stroke-width', '2');
    g.appendChild(line);

    // Entity name
    const nameText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    nameText.setAttribute('x', width / 2);
    nameText.setAttribute('y', headerHeight / 2 + 6);
    nameText.setAttribute('text-anchor', 'middle');
    nameText.setAttribute('font-family', 'Indie Flower, cursive');
    nameText.setAttribute('font-size', '16');
    nameText.setAttribute('font-weight', '600');
    nameText.textContent = entity.label;
    g.appendChild(nameText);

    // Fields
    if (entity.fields) {
      entity.fields.forEach((field, i) => {
        const y = headerHeight + 10 + i * fieldHeight;

        // Field name
        const fieldText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        fieldText.setAttribute('x', '10');
        fieldText.setAttribute('y', y + 15);
        fieldText.setAttribute('font-family', 'Indie Flower, cursive');
        fieldText.setAttribute('font-size', '14');
        if (field.pk) fieldText.setAttribute('font-weight', '600');
        fieldText.textContent = (field.pk ? 'PK ' : field.fk ? 'FK ' : '') + field.name;
        g.appendChild(fieldText);

        // Field type
        const typeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        typeText.setAttribute('x', width - 10);
        typeText.setAttribute('y', y + 15);
        typeText.setAttribute('text-anchor', 'end');
        typeText.setAttribute('font-family', 'Indie Flower, cursive');
        typeText.setAttribute('font-size', '12');
        typeText.setAttribute('fill', '#9ca3af');
        typeText.textContent = field.type;
        g.appendChild(typeText);
      });
    }

    return g;
  }
}

// Export
window.DiagramNodes = DiagramNodes;
