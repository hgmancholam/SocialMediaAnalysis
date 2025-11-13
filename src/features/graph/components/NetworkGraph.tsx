/**
 * NetworkGraph Component
 *
 * Force-directed network graph using D3.js
 * Features:
 * - Force simulation
 * - Drag nodes
 * - Zoom/Pan
 * - Node coloring by type/community
 * - Interactive edges
 * - Responsive
 */

'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useNetworkStore, type Node, type Edge } from '@/features/graph/store/network-store';

interface NetworkGraphProps {
  width?: number;
  height?: number;
  className?: string;
}

export function NetworkGraph({ width = 800, height = 600, className }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const { nodes, edges, selectedNode, setSelectedNode, setHoveredNode, layoutType, isPaused } =
    useNetworkStore();

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current);
    const container = svg.append('g');

    // Color scale for node types
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Create zoom behavior
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 10])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create force simulation
    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force(
        'link',
        d3
          .forceLink<Node, Edge>(edges)
          .id((d) => d.id)
          .distance(80)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(30));

    // Create edges
    const link = container
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d) => Math.sqrt(d.weight || 1));

    // Create nodes
    const node = container
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .call(
        d3
          .drag<SVGGElement, Node>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    // Add profile images or circles to nodes
    node.each(function (d) {
      const nodeGroup = d3.select(this);
      const radius = Math.sqrt(d.degree || 5) + 5;

      // Add a circular clip path for the image
      const clipId = `clip-${d.id}`;
      svg.append('defs').append('clipPath').attr('id', clipId).append('circle').attr('r', radius);

      if (d.profileImageUrl) {
        // Add profile image
        nodeGroup
          .append('image')
          .attr('xlink:href', d.profileImageUrl as string)
          .attr('x', -radius)
          .attr('y', -radius)
          .attr('width', radius * 2)
          .attr('height', radius * 2)
          .attr('clip-path', `url(#${clipId})`)
          .style('cursor', 'pointer')
          .on('click', (event) => {
            event.stopPropagation();
            setSelectedNode(d);
          })
          .on('mouseenter', () => {
            setHoveredNode(d);
          })
          .on('mouseleave', () => {
            setHoveredNode(null);
          })
          .on('error', function () {
            // Fallback to circle if image fails to load
            d3.select(this).remove();
            nodeGroup
              .append('circle')
              .attr('r', radius)
              .attr('fill', colorScale(d.type))
              .attr('stroke', '#fff')
              .attr('stroke-width', 2)
              .style('cursor', 'pointer')
              .on('click', (event) => {
                event.stopPropagation();
                setSelectedNode(d);
              })
              .on('mouseenter', () => {
                setHoveredNode(d);
              })
              .on('mouseleave', () => {
                setHoveredNode(null);
              });
          });

        // Add border circle around image (with click handlers)
        nodeGroup
          .append('circle')
          .attr('r', radius)
          .attr('fill', 'none')
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer')
          .on('click', (event) => {
            event.stopPropagation();
            setSelectedNode(d);
          })
          .on('mouseenter', () => {
            setHoveredNode(d);
          })
          .on('mouseleave', () => {
            setHoveredNode(null);
          });
      } else {
        // Fallback to colored circle if no profile image
        nodeGroup
          .append('circle')
          .attr('r', radius)
          .attr('fill', colorScale(d.type))
          .attr('stroke', '#fff')
          .attr('stroke-width', 2)
          .style('cursor', 'pointer')
          .on('click', (event) => {
            event.stopPropagation();
            setSelectedNode(d);
          })
          .on('mouseenter', () => {
            setHoveredNode(d);
          })
          .on('mouseleave', () => {
            setHoveredNode(null);
          });
      }
    });

    // Add labels to nodes
    node
      .append('text')
      .text((d) => d.label)
      .attr('font-size', '10px')
      .attr('dx', 12)
      .attr('dy', 4)
      .attr('fill', '#fff')
      .style('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (typeof d.source === 'object' ? d.source.x || 0 : 0))
        .attr('y1', (d) => (typeof d.source === 'object' ? d.source.y || 0 : 0))
        .attr('x2', (d) => (typeof d.target === 'object' ? d.target.x || 0 : 0))
        .attr('y2', (d) => (typeof d.target === 'object' ? d.target.y || 0 : 0));

      node.attr('transform', (d) => `translate(${d.x || 0},${d.y || 0})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active && !isPaused) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, Node, Node>) {
      if (!event.active && !isPaused) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    // Pause/resume simulation
    if (isPaused) {
      simulation.stop();
    }

    // Highlight selected node
    if (selectedNode) {
      node.each(function (d) {
        const nodeGroup = d3.select(this);
        const isSelected = d.id === selectedNode.id;

        // Update border circle stroke
        nodeGroup
          .selectAll('circle')
          .attr('stroke', isSelected ? '#3B82F6' : '#fff')
          .attr('stroke-width', isSelected ? 4 : 2);
      });
    }

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [
    nodes,
    edges,
    width,
    height,
    selectedNode,
    setSelectedNode,
    setHoveredNode,
    layoutType,
    isPaused,
  ]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className={className}
      style={{ background: '#0F1419', borderRadius: '8px' }}
    />
  );
}
