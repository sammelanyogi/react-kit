# @bhoos/react-kit-modal
A modal based on the standard react-native View, that uses react portal
to display modal and works with Context normally.

## Important
When using react portal with react-native the default iOS code would
throw an exception. The exception can be suppressed by commenting out
an assertion in the following code.

Modify `node_modules/react-native/React/Modules/RCTUIManager.m` at line
number 990 (RCT_EXPORT_METHOD createView), to comment out the assertion
that checks for validity of shadow view instance.

```objectivec
RCT_EXPORT_METHOD(createView
                  : (nonnull NSNumber *)reactTag viewName
                  : (NSString *)viewName rootTag
                  : (nonnull NSNumber *)rootTag props
                  : (NSDictionary *)props)
{
  RCTComponentData *componentData = _componentDataByName[viewName];
  if (componentData == nil) {
    RCTLogError(@"No component found for view with name \"%@\"", viewName);
  }

  // Register shadow view
  RCTShadowView *shadowView = [componentData createShadowViewWithTag:reactTag];
  if (shadowView) {
    [componentData setProps:props forShadowView:shadowView];
    _shadowViewRegistry[reactTag] = shadowView;
    RCTShadowView *rootView = _shadowViewRegistry[rootTag];
    // RCTAssert(
    //     [rootView isKindOfClass:[RCTRootShadowView class]] || [rootView isKindOfClass:[RCTSurfaceRootShadowView class]],
    //     @"Given `rootTag` (%@) does not correspond to a valid root shadow view instance.",
    //     rootTag);
    shadowView.rootView = (RCTRootShadowView *)rootView;
  }
```
