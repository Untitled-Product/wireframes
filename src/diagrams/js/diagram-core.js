/**
 * Diagram Core - SVG Render Engine
 * Renders node-based diagrams from JSON data
 */

class DiagramRenderer {
  constructor(container, options = {}) {
    this.container = typeof container === 'string'
      ? document.querySelector(container)
      : container;

    this.options = {
      width: options.width || 1200,
      height: options.height || 800,
      padding: options.padding || 50,
      gridSize: options.gridSize || 50,
      autoSize: options.autoSize !== false,
      interactive: options.interactive !== false,
      ...options
    };

    this.data = null;
    this.svg = null;
    this.nodesGroup = null;
    this.edgesGroup = null;
    this.groupsGroup = null;
    this.labelsGroup = null;
    this.nodeElements = new Map();
    this.edgeElements = new Map();

    this.nodeRenderer = null;
    this.edgeRenderer = null;
  }

  /**
   * Load and render diagram from JSON data or URL
   */
  async load(source) {
    if (typeof source === 'string') {
      // Load from URL
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error(`Failed to load diagram: ${response.statusText}`);
      }
      this.data = await response.json();
    } else {
      // Direct JSON data
      this.data = source;
    }

    this.render();
    return this;
  }

  /**
   * Main render method
   */
  render() {
    if (!this.data) {
      console.warn('DiagramRenderer: No data to render');
      return;
    }

    // Clear existing content
    this.container.innerHTML = '';

    // Calculate bounds
    const bounds = this.calculateBounds();

    // Create SVG
    this.createSVG(bounds);

    // Add defs (arrowheads, filters)
    this.addDefs();

    // Render in order: groups -> edges -> nodes -> labels
    this.renderGroups();
    this.renderEdges();
    this.renderNodes();
    this.renderAnnotations();

    // Add interactivity if enabled
    if (this.options.interactive) {
      this.addInteractivity();
    }

    // Dispatch rendered event
    this.container.dispatchEvent(new CustomEvent('diagram:rendered', {
      detail: { diagram: this.data }
    }));
  }

  /**
   * Calculate diagram bounds from node positions
   */
  calculateBounds() {
    if (!this.data.nodes || this.data.nodes.length === 0) {
      return {
        width: this.options.width,
        height: this.options.height,
        minX: 0,
        minY: 0
      };
    }

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const node of this.data.nodes) {
      const pos = node.position || { x: 0, y: 0 };
      const size = this.getNodeSize(node);

      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + size.width);
      maxY = Math.max(maxY, pos.y + size.height);
    }

    const padding = this.options.padding;

    return {
      width: Math.max(this.options.width, maxX - minX + padding * 2),
      height: Math.max(this.options.height, maxY - minY + padding * 2),
      minX: minX - padding,
      minY: minY - padding
    };
  }

  /**
   * Get estimated node size based on type
   */
  getNodeSize(node) {
    const sizes = {
      start: { width: 60, height: 60 },
      end: { width: 60, height: 60 },
      decision: { width: 100, height: 100 },
      page: { width: 140, height: 60 },
      action: { width: 140, height: 50 },
      api: { width: 160, height: 50 },
      database: { width: 120, height: 70 },
      service: { width: 140, height: 60 },
      data: { width: 140, height: 50 },
      entity: { width: 180, height: 100 },
      state: { width: 100, height: 50 },
      participant: { width: 120, height: 50 }
    };

    return sizes[node.type] || { width: 140, height: 50 };
  }

  /**
   * Create SVG element
   */
  createSVG(bounds) {
    this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this.svg.setAttribute('class', 'wf-diagram-svg');
    this.svg.setAttribute('viewBox', `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`);

    if (!this.options.autoSize) {
      this.svg.setAttribute('width', bounds.width);
      this.svg.setAttribute('height', bounds.height);
    }

    // Create layer groups
    this.groupsGroup = this.createGroup('diagram-groups');
    this.edgesGroup = this.createGroup('diagram-edges');
    this.nodesGroup = this.createGroup('diagram-nodes');
    this.labelsGroup = this.createGroup('diagram-labels');

    this.container.appendChild(this.svg);
  }

  /**
   * Create SVG group element
   */
  createGroup(className) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('class', className);
    this.svg.appendChild(group);
    return group;
  }

  /**
   * Add SVG defs (arrowheads, filters)
   */
  addDefs() {
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');

    // Standard arrowhead
    defs.innerHTML = `
      <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" class="wf-diagram-arrow"/>
      </marker>
      <marker id="arrowhead-error" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" class="wf-diagram-arrow wf-diagram-arrow--error"/>
      </marker>
      <marker id="arrowhead-data" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
        <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" class="wf-diagram-arrow wf-diagram-arrow--data"/>
      </marker>
      <filter id="sketchy-filter" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="3" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    `;

    this.svg.insertBefore(defs, this.svg.firstChild);
  }

  /**
   * Render all groups
   */
  renderGroups() {
    if (!this.data.groups) return;

    for (const group of this.data.groups) {
      this.renderGroup(group);
    }
  }

  /**
   * Render a single group
   */
  renderGroup(group) {
    // Find bounds of nodes in this group
    const groupNodes = this.data.nodes.filter(n => group.nodes.includes(n.id));
    if (groupNodes.length === 0) return;

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (const node of groupNodes) {
      const pos = node.position || { x: 0, y: 0 };
      const size = this.getNodeSize(node);
      minX = Math.min(minX, pos.x);
      minY = Math.min(minY, pos.y);
      maxX = Math.max(maxX, pos.x + size.width);
      maxY = Math.max(maxY, pos.y + size.height);
    }

    const padding = 30;
    const labelHeight = 25;

    // Create group rectangle
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    rect.setAttribute('x', minX - padding);
    rect.setAttribute('y', minY - padding - labelHeight);
    rect.setAttribute('width', maxX - minX + padding * 2);
    rect.setAttribute('height', maxY - minY + padding * 2 + labelHeight);
    rect.setAttribute('class', `wf-diagram-group wf-diagram-group--${group.color || 'teal'}`);
    rect.setAttribute('rx', '16');
    rect.setAttribute('fill', 'rgba(20, 184, 166, 0.05)');
    rect.setAttribute('stroke', '#14b8a6');
    rect.setAttribute('stroke-width', '2');
    rect.setAttribute('stroke-dasharray', '8,4');

    this.groupsGroup.appendChild(rect);

    // Add group label
    if (group.label) {
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', minX - padding + 16);
      text.setAttribute('y', minY - padding - 5);
      text.setAttribute('class', 'wf-diagram-group__label');
      text.setAttribute('font-family', 'Indie Flower, cursive');
      text.setAttribute('font-size', '14');
      text.setAttribute('font-weight', '600');
      text.setAttribute('fill', '#0d9488');
      text.textContent = group.label;
      this.groupsGroup.appendChild(text);
    }
  }

  /**
   * Render all edges
   */
  renderEdges() {
    if (!this.data.edges) return;

    for (const edge of this.data.edges) {
      this.renderEdge(edge);
    }
  }

  /**
   * Render a single edge
   */
  renderEdge(edge) {
    const sourceNode = this.data.nodes.find(n => n.id === edge.source);
    const targetNode = this.data.nodes.find(n => n.id === edge.target);

    if (!sourceNode || !targetNode) {
      console.warn(`DiagramRenderer: Edge references unknown node`, edge);
      return;
    }

    const sourcePos = this.getNodeCenter(sourceNode);
    const targetPos = this.getNodeCenter(targetNode);

    // Calculate path
    const path = this.calculateEdgePath(sourcePos, targetPos, sourceNode, targetNode, edge);

    // Create path element
    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', path);
    pathEl.setAttribute('class', `wf-diagram-edge wf-diagram-edge--${edge.type || 'flow'}`);
    pathEl.setAttribute('data-edge-id', edge.id);

    // Set arrowhead based on edge type
    const arrowhead = edge.type === 'error' ? 'arrowhead-error'
                    : edge.type === 'data' ? 'arrowhead-data'
                    : 'arrowhead';
    pathEl.setAttribute('marker-end', `url(#${arrowhead})`);

    this.edgesGroup.appendChild(pathEl);
    this.edgeElements.set(edge.id, pathEl);

    // Add edge label if present
    if (edge.label) {
      this.renderEdgeLabel(edge, sourcePos, targetPos);
    }
  }

  /**
   * Calculate edge path with smooth curves
   */
  calculateEdgePath(source, target, sourceNode, targetNode, edge) {
    const sourceSize = this.getNodeSize(sourceNode);
    const targetSize = this.getNodeSize(targetNode);

    // Determine connection points
    const sourcePoint = this.getConnectionPoint(source, target, sourceSize, sourceNode.type);
    const targetPoint = this.getConnectionPoint(target, source, targetSize, targetNode.type);

    // Calculate control points for bezier curve
    const dx = targetPoint.x - sourcePoint.x;
    const dy = targetPoint.y - sourcePoint.y;
    const midX = sourcePoint.x + dx / 2;
    const midY = sourcePoint.y + dy / 2;

    // Determine if we need vertical or horizontal curve
    if (Math.abs(dx) > Math.abs(dy)) {
      // More horizontal - use horizontal S-curve
      return `M ${sourcePoint.x} ${sourcePoint.y}
              C ${midX} ${sourcePoint.y}, ${midX} ${targetPoint.y}, ${targetPoint.x} ${targetPoint.y}`;
    } else {
      // More vertical - use vertical S-curve
      return `M ${sourcePoint.x} ${sourcePoint.y}
              C ${sourcePoint.x} ${midY}, ${targetPoint.x} ${midY}, ${targetPoint.x} ${targetPoint.y}`;
    }
  }

  /**
   * Get node center position
   */
  getNodeCenter(node) {
    const pos = node.position || { x: 0, y: 0 };
    const size = this.getNodeSize(node);
    return {
      x: pos.x + size.width / 2,
      y: pos.y + size.height / 2
    };
  }

  /**
   * Get connection point on node edge
   */
  getConnectionPoint(nodeCenter, targetCenter, nodeSize, nodeType) {
    const dx = targetCenter.x - nodeCenter.x;
    const dy = targetCenter.y - nodeCenter.y;
    const angle = Math.atan2(dy, dx);

    // Special handling for circular nodes (start/end)
    if (nodeType === 'start' || nodeType === 'end') {
      const radius = 30;
      return {
        x: nodeCenter.x + Math.cos(angle) * radius,
        y: nodeCenter.y + Math.sin(angle) * radius
      };
    }

    // Special handling for decision (diamond)
    if (nodeType === 'decision') {
      const halfSize = 50;
      // Simplified - connect to corners
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

    // Rectangle nodes - find edge intersection
    const halfWidth = nodeSize.width / 2;
    const halfHeight = nodeSize.height / 2;

    // Determine which edge to connect to
    if (Math.abs(dx) * halfHeight > Math.abs(dy) * halfWidth) {
      // Connect to left or right edge
      return {
        x: nodeCenter.x + (dx > 0 ? halfWidth : -halfWidth),
        y: nodeCenter.y + (dy / Math.abs(dx)) * halfWidth * (dx > 0 ? 1 : -1)
      };
    } else {
      // Connect to top or bottom edge
      return {
        x: nodeCenter.x + (dx / Math.abs(dy)) * halfHeight * (dy > 0 ? 1 : -1),
        y: nodeCenter.y + (dy > 0 ? halfHeight : -halfHeight)
      };
    }
  }

  /**
   * Render edge label
   */
  renderEdgeLabel(edge, source, target) {
    const midX = (source.x + target.x) / 2;
    const midY = (source.y + target.y) / 2;

    // Background
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const textWidth = edge.label.length * 8 + 16;
    bgRect.setAttribute('x', midX - textWidth / 2);
    bgRect.setAttribute('y', midY - 12);
    bgRect.setAttribute('width', textWidth);
    bgRect.setAttribute('height', 24);
    bgRect.setAttribute('rx', '4');
    bgRect.setAttribute('class', 'wf-diagram-edge-label-bg');
    this.labelsGroup.appendChild(bgRect);

    // Text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', midX);
    text.setAttribute('y', midY + 4);
    text.setAttribute('class', 'wf-diagram-edge-label');
    text.textContent = edge.label;
    this.labelsGroup.appendChild(text);
  }

  /**
   * Render all nodes
   */
  renderNodes() {
    if (!this.data.nodes) return;

    for (const node of this.data.nodes) {
      this.renderNode(node);
    }
  }

  /**
   * Render a single node
   */
  renderNode(node) {
    const pos = node.position || { x: 0, y: 0 };
    const size = this.getNodeSize(node);

    // Create foreignObject to embed HTML
    const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
    fo.setAttribute('x', pos.x);
    fo.setAttribute('y', pos.y);
    fo.setAttribute('width', size.width);
    fo.setAttribute('height', size.height);
    fo.setAttribute('data-node-id', node.id);

    // Create HTML node element
    const nodeEl = document.createElement('div');
    nodeEl.className = `wf-diagram-node wf-diagram-node--${node.type}`;
    nodeEl.setAttribute('data-node-id', node.id);

    // Add label
    const labelEl = document.createElement('div');
    labelEl.className = 'wf-diagram-node__label';
    labelEl.textContent = node.label;
    nodeEl.appendChild(labelEl);

    // Add sublabel if present
    if (node.sublabel) {
      const sublabelEl = document.createElement('div');
      sublabelEl.className = 'wf-diagram-node__sublabel';
      sublabelEl.textContent = node.sublabel;
      nodeEl.appendChild(sublabelEl);
    }

    fo.appendChild(nodeEl);
    this.nodesGroup.appendChild(fo);
    this.nodeElements.set(node.id, { fo, nodeEl });
  }

  /**
   * Render annotations
   */
  renderAnnotations() {
    if (!this.data.annotations) return;

    for (const annotation of this.data.annotations) {
      const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      fo.setAttribute('x', annotation.position.x);
      fo.setAttribute('y', annotation.position.y);
      fo.setAttribute('width', '200');
      fo.setAttribute('height', '100');

      const annotEl = document.createElement('div');
      annotEl.className = 'wf-diagram-annotation';
      annotEl.textContent = annotation.text;

      fo.appendChild(annotEl);
      this.labelsGroup.appendChild(fo);
    }
  }

  /**
   * Add interactivity (hover, click)
   */
  addInteractivity() {
    // Node click handling
    this.nodesGroup.addEventListener('click', (e) => {
      const nodeEl = e.target.closest('[data-node-id]');
      if (!nodeEl) return;

      const nodeId = nodeEl.getAttribute('data-node-id');
      const node = this.data.nodes.find(n => n.id === nodeId);

      if (node && node.metadata && node.metadata.wireframe) {
        // Navigate to wireframe
        this.container.dispatchEvent(new CustomEvent('diagram:node-click', {
          detail: { node, wireframe: node.metadata.wireframe }
        }));
      }
    });

    // Edge hover handling
    this.edgesGroup.addEventListener('mouseenter', (e) => {
      if (e.target.classList.contains('wf-diagram-edge')) {
        e.target.style.strokeWidth = '3';
      }
    }, true);

    this.edgesGroup.addEventListener('mouseleave', (e) => {
      if (e.target.classList.contains('wf-diagram-edge')) {
        e.target.style.strokeWidth = '';
      }
    }, true);
  }

  /**
   * Get diagram info
   */
  getInfo() {
    if (!this.data) return null;
    return {
      id: this.data.id,
      type: this.data.type,
      title: this.data.title,
      description: this.data.description,
      version: this.data.version,
      nodeCount: this.data.nodes?.length || 0,
      edgeCount: this.data.edges?.length || 0
    };
  }

  /**
   * Export as SVG string
   */
  exportSVG() {
    if (!this.svg) return null;
    return new XMLSerializer().serializeToString(this.svg);
  }

  /**
   * Zoom to fit
   */
  zoomToFit() {
    const bounds = this.calculateBounds();
    this.svg.setAttribute('viewBox', `${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`);
  }

  /**
   * Highlight a node
   */
  highlightNode(nodeId, highlight = true) {
    const nodeData = this.nodeElements.get(nodeId);
    if (nodeData) {
      nodeData.nodeEl.classList.toggle('wf-diagram-node--highlighted', highlight);
    }
  }

  /**
   * Highlight connected path from start to end
   */
  highlightPath(nodeIds, highlight = true) {
    for (const nodeId of nodeIds) {
      this.highlightNode(nodeId, highlight);
    }

    // Highlight edges between consecutive nodes
    for (let i = 0; i < nodeIds.length - 1; i++) {
      const edge = this.data.edges.find(e =>
        e.source === nodeIds[i] && e.target === nodeIds[i + 1]
      );
      if (edge) {
        const edgeEl = this.edgeElements.get(edge.id);
        if (edgeEl) {
          edgeEl.classList.toggle('wf-diagram-edge--highlighted', highlight);
        }
      }
    }
  }
}

// Export for use in pages
window.DiagramRenderer = DiagramRenderer;
