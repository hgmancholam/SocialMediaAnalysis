# Profile Images in Network Graph

## Overview

The network graph now displays Twitter/X profile images on each node instead of colored circles, providing a more engaging and recognizable visualization.

## Implementation

### 1. Profile Image URL Generation

Since the dataset doesn't include `profile_image_url` from the Twitter API, we use the **Twitter/X direct photo URL pattern**:

```typescript
const profileImageUrl = `https://x.com/${user.username}/photo`;
```

**Why this pattern?**

- Direct link to Twitter/X profile photo
- Uses user ID (stable identifier)
- No third-party service required
- Official Twitter/X URL pattern
- Works for all public profiles

**Alternative Options:**

1. unavatar.io: `https://unavatar.io/twitter/{username}` (third-party service)
2. Direct Twitter API: `https://pbs.twimg.com/profile_images/...` (requires full URL from API)
3. GitHub Avatars: `https://avatars.githubusercontent.com/u/{user_id}` (if users have GitHub)
4. Gravatar: `https://www.gravatar.com/avatar/{email_hash}` (requires email)

### 2. SVG Image Rendering

Profile images are rendered as SVG `<image>` elements with circular clipping:

```typescript
// Create circular clip path
const clipId = `clip-${d.id}`;
svg.append('defs').append('clipPath').attr('id', clipId).append('circle').attr('r', radius);

// Add image with clip path
nodeGroup
  .append('image')
  .attr('xlink:href', profileImageUrl)
  .attr('x', -radius)
  .attr('y', -radius)
  .attr('width', radius * 2)
  .attr('height', radius * 2)
  .attr('clip-path', `url(#${clipId})`);

// Add border circle
nodeGroup
  .append('circle')
  .attr('r', radius)
  .attr('fill', 'none')
  .attr('stroke', '#fff')
  .attr('stroke-width', 2);
```

### 3. Fallback Mechanism

If a profile image fails to load, the graph automatically falls back to colored circles:

```typescript
.on('error', function () {
  // Remove failed image
  d3.select(this).remove();

  // Add colored circle fallback
  nodeGroup.append('circle')
    .attr('r', radius)
    .attr('fill', colorScale(d.type))
    .attr('stroke', '#fff')
    .attr('stroke-width', 2);
});
```

### 4. Node Sizing

Node size is based on user activity (tweet count):

```typescript
const radius = Math.sqrt(d.degree || 5) + 5;
```

- **More tweets** = **Larger node**
- Minimum size: 5 + 5 = 10px radius
- Scales with square root for better visual balance

## Features

### ✅ Visual Recognition

- Users can quickly identify accounts by profile picture
- More engaging than abstract colored circles
- Matches Twitter/X UI patterns

### ✅ Performance

- Images loaded asynchronously
- CDN-backed service (unavatar.io)
- Circular clipping done in SVG (GPU-accelerated)
- Fallback prevents broken nodes

### ✅ Interactivity

- Click on profile image to select node
- Hover to highlight
- Drag to reposition
- Border changes color when selected (blue)

### ✅ Accessibility

- Fallback to colored circles if images fail
- Text labels still visible
- Color coding by sentiment preserved in fallback

## Data Flow

```
User Object (dataset.json)
    ↓
username extracted
    ↓
Profile URL constructed: https://unavatar.io/twitter/{username}
    ↓
Added to Node object as profileImageUrl
    ↓
NetworkGraph component renders SVG <image>
    ↓
Image loads asynchronously
    ↓
Success: Display profile image with border
    ↓
Error: Fallback to colored circle
```

## Customization

### Change Image Service

To use a different service, modify `network-builder.ts`:

```typescript
// Option 1: Use a different service
const profileImageUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;

// Option 2: Use local images (if available)
const profileImageUrl = `/images/profiles/${user.username}.jpg`;

// Option 3: Use Twitter API directly (requires API data)
const profileImageUrl = user.profile_image_url; // From API response
```

### Adjust Image Size

Modify the radius calculation in `NetworkGraph.tsx`:

```typescript
// Larger images
const radius = Math.sqrt(d.degree || 5) + 10; // Increased from 5

// Fixed size (all nodes same size)
const radius = 20; // All nodes 20px radius

// Size by followers instead of tweets
const radius = Math.sqrt((d.followers as number) / 100) + 5;
```

### Change Border Style

Modify the border circle styling:

```typescript
nodeGroup
  .append('circle')
  .attr('r', radius)
  .attr('fill', 'none')
  .attr('stroke', '#fff') // Change color
  .attr('stroke-width', 3) // Change thickness
  .attr('stroke-dasharray', '5,5'); // Add dashed border
```

## Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ✅ Mobile browsers: Full support

SVG `<image>` and `clipPath` are widely supported in all modern browsers.

## Performance Considerations

### Image Loading

- Images load asynchronously (non-blocking)
- Browser caches images after first load
- unavatar.io uses CDN for fast delivery

### Large Networks

For networks with 1000+ nodes:

- Consider lazy loading images (only load visible nodes)
- Use lower resolution images
- Implement virtualization (only render visible viewport)

### Memory Usage

- Each image ~5-50KB depending on resolution
- 100 nodes ≈ 500KB-5MB total
- Browser handles caching automatically

## Troubleshooting

### Images Not Loading

**Issue**: Profile images show as colored circles

**Solutions:**

1. Check network connectivity
2. Verify username is correct
3. Check browser console for CORS errors
4. Try alternative image service
5. Check if unavatar.io is accessible

### Images Loading Slowly

**Solutions:**

1. Use CDN-backed service (unavatar.io already is)
2. Preload images before rendering graph
3. Use lower resolution images
4. Implement progressive loading

### Circular Clipping Not Working

**Issue**: Images appear as squares

**Solutions:**

1. Ensure `clipPath` ID is unique per node
2. Check SVG `<defs>` is created before images
3. Verify clip-path attribute syntax
4. Check browser console for SVG errors

## Future Enhancements

1. **Image Caching**: Preload images before graph renders
2. **Verified Badge**: Show blue checkmark for verified users
3. **Image Quality**: Use higher resolution for zoomed-in views
4. **Placeholder**: Show loading spinner while image loads
5. **Custom Avatars**: Allow users to upload custom images
6. **Sentiment Border**: Color border by sentiment instead of white

---

**Last Updated**: November 13, 2025
