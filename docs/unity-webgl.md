# Unity WebGL builds

A Unity WebGL build is a `unity` media item on a project. It gets its own tab in the project modal ("Play in browser" by default) and adds a **Live Demo** button that opens it full-page.

## Adding a build

1. In Unity, build for **WebGL** (or WebGPU). The output folder contains `index.html`, `Build/` and usually `TemplateData/`.
2. `npm run admin` → the project → **Media** → **🎮 Unity WebGL build folder…** → pick that output folder.
3. The admin uploads the whole folder to `content/projects/<slug>/media/<folder>/` and adds:

```json
{ "type": "unity", "src": "<folder>/index.html", "title": "Play in browser" }
```

Rename the tab with the title field. Removing the item in the admin moves the build folder to `.trash/`.

By hand: copy the build into `content/projects/<slug>/media/unity/` and add the item above to `media` in `project.json`.

## How it is served

- Dev: the content plugin serves `content/projects/<slug>/media/**` at `/projects/<slug>/…` (correct MIME types, including `.wasm`).
- Build: the folder is copied to `dist/projects/<slug>/` unchanged.
- The modal renders it in a sandboxed iframe (`UnityFrame`, `src/features/projects/media/renderers.jsx` in `@loom/kit-portfolio`) and, when the tab closes, calls `window.cleanupUnity()` or `unityInstance.Quit()` inside the frame if the build exposes them — expose one from your WebGL template to free GPU memory promptly.

## Notes

- Prefer **Brotli or Gzip compression with "Decompression Fallback"** enabled in Unity's Player Settings: GitHub Pages does not send `Content-Encoding` for pre-compressed files, so builds without the fallback fail to load.
- Large builds count against the GitHub Pages size limits (1 GB per site, 100 MB per file). The Predictive Projectile Motion build is ~96 MB in total.

## Best Practices

### 1. Unity WebGL Optimization
- Optimize your Unity build for web deployment
- Consider file size and loading times
- Test cross-browser compatibility

### 2. User Experience
- Provide clear instructions in the Web Build tab
- Include game controls information
- Consider loading states for large builds

### 3. Performance
- Monitor iframe performance
- Consider lazy loading for multiple Unity builds
- Test on different devices and connections

## Troubleshooting

### Tab Not Showing
- The project's `media` list needs an item with `"type": "unity"`
- Its `src` must point at the build's `index.html` inside the project's `media/` folder

### Unity Build Not Loading
- Check browser console for errors
- Verify Unity WebGL build compatibility
- Ensure all Unity build files are present

### Styling Issues
- Check CSS variables in `variables.css`
- Verify responsive design on different screen sizes
- Test modal behavior with Unity iframe

## Future Enhancements

Potential improvements for the Unity WebGL integration:

1. **Loading States**: Add progress indicators for Unity builds
2. **Mobile Optimization**: Improve touch controls for mobile devices
3. **Performance Monitoring**: Add analytics for Unity build performance

(Fullscreen play and multiple builds per project — one tab each — are supported.)

## Support

For issues or questions about Unity WebGL integration:
1. Check the browser console for errors
2. Verify Unity build file structure
3. Test with different browsers
4. Review Unity WebGL documentation
