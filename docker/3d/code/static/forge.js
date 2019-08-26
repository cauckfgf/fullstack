var documentPath = '/static/forgeData.json'
var viewer3D;
var viewer2D;
var _blockEventMain = false;
var _blockEventSecondary = false;

Autodesk.Viewing.Initializer({ env: 'Local' }, function() {
    //创建3D视口
    viewer3D = new Autodesk.Viewing.Private.GuiViewer3D(document.querySelector("#forge-viewer"), {});
    //创建2D视口
    // viewer2D = new Autodesk.Viewing.Private.GuiViewer3D(document.querySelector("#minimap"), {});
    //隐藏2D视口的工具条
    // viewer2D.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function(event) {
    //     viewer2D.toolbar.setVisible(false);
    // });
    viewer3D.start();
    // viewer2D.start();

    //鼠标选择联动 3D-2D
    viewer3D.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(event) {
        if (_blockEventSecondary)
            return;
        _blockEventMain = true;
        // viewer2D.select(viewer3D.getSelection());
        _blockEventMain = false;
    });

    //鼠标选择联动 2D-3D
    // viewer2D.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, function(event) {
    //     if (_blockEventMain)
    //         return;
    //     _blockEventSecondary = true;
    //     viewer3D.select(viewer2D.getSelection());
    //     viewer3D.fitToView(viewer2D.getSelection())
    //     _blockEventSecondary = false;
    // });




    //加载文档
    Autodesk.Viewing.Document.load(documentPath,
        function(document) {
            var geometryItems3D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {
                'type': 'geometry',
                'role': '3d'
            }, true);
            // var geometryItems2D = Autodesk.Viewing.Document.getSubItemsWithProperties(document.getRootItem(), {
            //     'type': 'geometry',
            //     'role': '2d'
            // }, true);
            viewer3D.load(document.getViewablePath(geometryItems3D[0]), null);
            // viewer2D.load(document.getViewablePath(geometryItems2D[0]), null);

            // viewer3D.initialize();
            // viewer3D.loadModel('http://modelbucket.oss-cn-shanghai.aliyuncs.com/east_hospital/MEPSystemType11/0/0.svf',{},()=>{})
        },
        // onErrorCallback
        function(msg) {
            console.log("Error loading document: " + msg);
        }
    );
});