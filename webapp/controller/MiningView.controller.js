sap.ui.define([
    "./BaseController",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"

   
], (BaseController, MessageBox, Filter,FilterOperator,Sorter) => {
    "use strict";

    return BaseController.extend("app.miningproject.controller.MiningView", {
        onInit() {
            // this._getData();
            let oRouter = this.getOwnerComponent().getRouter();
            // oRouter.attachRoutePatternMatched(this.onRouteMatched, this);
            let oRoute = oRouter.getRoute("RouteMiningView");
            oRoute.attachPatternMatched(this._onPatternMatched, this);
        },
        _onPatternMatched: function () {
          this._getData();
        },

        _getData:function(){
            let entitySet="/Z9215_MININGSet";
            let oModel=this.getOwnerComponent().getModel();
            oModel.read(entitySet,{
                success:(oData,resp)=>{

                    var oModelData = new sap.ui.model.json.JSONModel(oData.results);
                    this.getView().getParent().setModel(oModelData, "MiningDetails");
                    // let oModelJs=new sap.ui.model.json.JSONModel(odata)
                    // this.getView().setModel(oModelJs,"MiningModel")
                    
                },
                error:(error)=>{
                    console.log(error)
                }
            })
        },

        onCreate: function () {
            var oRouter = this.getOwnerComponent().getRouter()
            oRouter.navTo("RouteCreateView")
 
        },
        onDelete:function(oEvent){
            let oContext=oEvent.getSource().getBindingContext("MiningDetails").getObject()
            MessageBox.confirm("Are you sure wants to Delete ?", {
                onClose:(choice)=>{
                    if(choice==='OK'){
                    this._onDeleteCall(oContext)
                    }
                }
            })
        },
        onSearch:function(oControlEvent){
            // let aFilter=[]
            // let sLocId=this.getView().byId("idFilterLoc").getValue()
            // let sDes=this.getView().byId("idFilterDes").getValue() 
            // let sMinRe=this.getView().byId("idFilterMinRe").getValue()
            // if(sLocId){
            //   let filterName=new Filter("LocationId", FilterOperator.Contains,sLocId)                    
            //   aFilter.push(filterName)
            // }
            // if(sDes){
            //     let filterName=new Filter("Description", FilterOperator.Contains,sDes)                    
            //     aFilter.push(filterName)
            //   }
            
         
            // let oTable=this.getView().byId("idMiningTab")
            // let oBinding=oTable.getBinding("items")
            //     oBinding.filter(aFilter);
            var oSearchStr = oControlEvent.getParameter("query") || oControlEvent.getParameter("newValue");
            var oName = new Filter("Description", FilterOperator.Contains, oSearchStr);
            var oAvail = new Filter("MineralResource", FilterOperator.Contains, oSearchStr);
            var aFilter = [oName, oAvail];
            var oMainFilter = new Filter({
                filters: aFilter,
                and: false
            });
            var oList = this.getView().byId("idMiningTab");
            var oBindList = oList.getBinding("items");
            oBindList.filter(oMainFilter);
 
 
        },
        _onDeleteCall:function(parm){
            let key1= parm.LocationId
            let key2= parm.Description
            let key3= parm.MineralResource
            key2=key2.replace(/ /g, "%20");
            key3=key3.replace(/ /g, "%20");
   
            let oModel=this.getOwnerComponent().getModel();
            let entity="/Z9215_MININGSet(LocationId='"+key1+"',Description='"+key2+"',MineralResource='"+key3+"')"
            // let that=this
            oModel.remove(entity,{
                success:(resp)=>{
                    MessageBox.success("Record Deleted", {
                        onClose:function(){
                         this._getData();
                        }.bind(this)
                    })
                },
                error:(err)=>{
                    MessageBox.error("Deletion failed")
                }
            })
        },
        onItemSelect: function (oEvent) {
            var oList = oEvent.getParameter("listItem");
            let sPath = oList.getBindingContext("MiningDetails").getPath()
            let aItems = sPath.split("/");
            let id = aItems[aItems.length - 1];
            let oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("RouteDetailView", {
                index: id
            });
 
        }
    });
});