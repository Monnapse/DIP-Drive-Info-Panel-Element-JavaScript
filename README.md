# Drive-Info-Panel-Element-JavaScript
Create a simple info panel for your drive

Example :
```
var dip = DriveInfoPanel();
dip.SetDriveSize(107374182400);
dip.addCategory("Videos", "cloud-info-color-Videos", 53387071200, 31);
dip.addCategory("Images", "cloud-info-color-Images", 16146127360, 4358);
dip.addFreeSpaceCategory("Free Space", "drive-info-categor-color-default");
dip.sortCategories(-1);
dip.render();
dip.Panel.style.zIndex = 999;
document.body.insertBefore(dip.Panel, document.body.firstChild);
```

A Screenshot :
[![screenshot]([https://github.com/monnapse/Drive-Info-Panel-Element-JavaScript/blob/[branch]/image.jpg](https://github.com/Monnapse/Drive-Info-Panel-Element-JavaScript/blob/main/preview.png)?raw=true)](https://github.com/Monnapse/Drive-Info-Panel-Element-JavaScript/blob/main/preview.png)
