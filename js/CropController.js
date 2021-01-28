angular
    .module('myApp', [])
    .controller('ImgCropController', function($scope) {


        //setting up the Canvas
        const canvas = window.canvas = new fabric.Canvas('canvas', { controlsAboveOverlay: false })

        canvas.setDimensions({ width: 768, height: 768 })
        canvas.preserveObjectStacking = true;
        fabric.util.createAccessors && fabric.util.createAccessors(fabric.Object);
        fabric.Object.prototype.transparentCorners = false;

        // *****************************************************************
        $scope.selectedObject = null;
        $scope.deletingInProgress = false;
        $scope.isCrop = false;
        $scope.Wdifference, $scope.Hdifference;


        $scope.addImage = function(imgLink, left, top) {
            //if image is wider or heigher then the current canvas, we'll scale id down

            console.log(canvas.getActiveObjects());
            fabric.Image.fromURL(imgLink, function(img) {
                img.set({ 'lockUniScaling': false });
                img.set({ 'selectable': true });
                img.oldScaleX = img.scaleX;
                img.oldScaleY = img.scaleY;
                img.oldWidth = img.width;
                img.oldHeight = img.height;
                img.scaleX = .8
                img.scaleY = .8
                canvas.add(img);
                img.viewportCenter();
                canvas.renderAll();
            });
        }

        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = 'blue';
        fabric.Object.prototype.cornerStyle = 'circle';



        $scope.removeMasking = function() {
            console.log("removeMasking func()")
        }

        $scope.editMasking = function(status) {
            console.log("editMasking func()")
        }

        // MASKING STARTS ******************************/

        $scope.SVGMASK = function(maskingObjPath, scaleVal) {
            fabric.loadSVGFromURL(maskingObjPath, function(objects, options) {
                svgData = fabric.util.groupSVGElements(objects, options);
                svgData.objectCaching = false;
                canvas.add(svgData);
                canvas.renderAll();   
            });
        }

        /*MASKING ENDS ********************************/


        $scope.deleteObject = function() {
            $scope.deletingInProgress = true;
            var activeObject = canvas.getActiveObjects();
            if (activeObject) {
                activeObject.forEach(function(object) {
                    canvas.remove(object);
                });
                canvas.discardActiveObject();
            }
            canvas.renderAll();
            $scope.deletingInProgress = false;
        }


        $scope.cloneObject = function() {
            var object = fabric.util.object.clone(canvas.getActiveObject());
            console.log("before", object)
            object.set("top", object.top + 25);
            object.set("left", object.left + 25);
            canvas.add(object);
            canvas.setActiveObject(object);
            var NewObject = canvas.getActiveObject();
            console.log("after", NewObject)
            canvas.requestRenderAll();
        };

        $scope.obtainCanvasData = function() {
            var blockData = JSON.stringify(canvas.toJSON());
            $scope.canvasData = blockData;

        }

        $scope.LoadJson = function() {
            canvas.loadFromJSON($scope.canvasData);
            fabric.util.enlivenObjects($scope.canvasData.objects, function(objects) {
                objects.forEach(function(o) {
                    canvas.add(o);
                    canvas.setActiveObject(o);
                });
            })
            canvas.renderAll();
        }
    });