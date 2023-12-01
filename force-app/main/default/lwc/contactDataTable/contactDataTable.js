import { LightningElement,track } from 'lwc';
import getContact from '@salesforce/apex/contactApexController.getAllContact'
import getContactCount from '@salesforce/apex/contactApexController.getContactCount'
import Name from '@salesforce/schema/Account.Name';
import LeadSource from '@salesforce/schema/Contact.LeadSource';

const constant ={
 PUBLIC_RELATION : 'Public Relations'

}
export default class ContactDataTable extends LightningElement {
   
   // * Table Data
   employeeData=[];
   
   originalEmployeeData =[];

   // * Sorting Attributes 
   sortedBy ='Name';
   SortedDirection ='asc';
   defaultSortDirection ='asc'

   //* selected row 
   selectedRows=[];

   //* infinite loading parameter
   recordsLimit = 5;
   totalNumberofRecord =0;
   isLoading =false;
   enableinfiniteLoading = true;

   //* filter based 
   recordFilter ={};

   //* inline edit parameter
   draftValues=[];


   //* Define action column as per documentation action column should be array of action with label/Name pairs
   /*  Comment row level static acction ...will build dynamic action based on row data.
   rowaction =[
      {
         label:'view', //value available on UI
         name :'view'  // value used in backend
      },
      {
         label:'edit',
         name:'edit',
      },
      {
         label:'delete',
         name:'delete'
      }
   ]
   */

   //* Used to create a dynamic row level action.
   //accept row : each row data sent and based on row we gonna decide weather to choose which 
   //action is required 
   // callBack ...it's a way to handle async call in js ...once we have action ready we gonna return thr same.
   //
   dynamicAction(row,callBack)
   {
      console.log('----///----row check ',row);
       const rowaction =[
         {
            label:'view', //value available on UI
            name :'view' , // value used in backend
            iconName: 'action:preview'
         },
         {
            label:'edit',
            name:'edit',
            iconName:'action:edit'
            
         }
      ];
       if(row['LeadSource'] != constant.PUBLIC_RELATION)
      {
         rowaction.push({
            label:'delete',
            name:'delete',
            iconName:'action:delete'
         })
      }
      // we can also make apex callout determine the actions 
      setTimeout(()=>{
         callBack(rowaction);
      },1000)
   }
   
   // * Table columns
   employeeColumn=[
   
      // Modified column to support the URL
      {
         
         label:'Name', 
         fieldName:'contactUrl',
         type:'url',
         typeAttributes:{
            label: {
               fieldName:'Name' //value which we want to show on UI
            },
            target:'_blank',
            tooltip:'View contact'

         },
         sortable:true,
         initialWidth :80,
         hideDefaultActions:true,
         editable: true
      },
      {
         label:'Phone', 
         fieldName:'Phone',
         type:'phone',
         sortable:true,
         initialWidth :80,
         hideDefaultActions:true,
         editable: true
      },
      {
         label:'Email', 
         fieldName:'Email',
         type:'email',
         sortable:true,
         initialWidth :100,
         hideDefaultActions:true,
         editable: true
      },
      //column having custom action 
      {
         label:'Lead Source', 
         fieldName:'LeadSource',
         actions:[
          { label : 'All' ,checked: true, name: 'all' },  
          { label : 'Web' ,checked: false, name: 'Web' },  
          { label : 'Phone Inquiry' ,checked: false, name: 'Phone_Inquiry' },  
          { label : 'Partner Referral' ,checked: false, name: 'Partner_Referral' },  
          { label : 'External Referral' ,checked: false, name: 'External_Referral' },
          { label : 'Partner	Partner' ,checked: false, name: 'Partner_Partner' },
          { label : 'Public Relations' ,checked: false, name: 'Public_Relations' },
          { label : 'Trade Show' ,checked: false, name: 'Trade_Show' },
          { label : 'Word of mouth' ,checked: false, name: 'Word_of_mouth' },
          { label : 'Employee Referral' ,checked: false, name: 'Employee_Referral' },
          { label : 'Other' ,checked: false, name: 'Other' },
         ],
         sortable:true,
         wrapText:true,
         initialWidth :100,
         hideDefaultActions:true,
         editable: true,
         type :'pickList' ,// refer custom component libs-datatable there picklist is defined.
         typeAttributes:{
             name :'LeadSource',
             placeholder : 'Lead Source',
             readonly :true,
             options :[
              
               { label : 'Web' , value: 'Web' },  
               { label : 'Phone Inquiry' , value: 'Phone Inquiry' },  
               { label : 'Partner Referral' , value: 'Partner Referral' },  
               { label : 'External Referral' , value: 'External Referral' },
               { label : 'Partner Partner' , value: 'Partner Partner' },
               { label : 'Public Relations' , value: 'Public Relations' },
               { label : 'Trade Show' , value: 'Trade Show' },
               { label : 'Word of mouth' , value: 'Word of mouth' },
               { label : 'Employee Referral' , value: 'Employee Referral' },
               { label : 'Other', value: 'Other' }
             ],
             recordID:{
               fieldName:'Id'  // use the id value of contact record 
             }
         },
         //to all cell of leadsource column if editCellCss is applied the it will effect the UI
         //edit cell value should popolated from JS code.
         // on each record of dt we need to add editCellCss propety via code and provide there some value
         cellAttributes:{
            class:{
               fieldName:'editCellCss'
            }
         }
         //re-cap : apply the class to the my leadsource column and the value of the class we will get from
         // property/field of current record's editCellCss attributes.
      },
      {
         label:'Account Name', 
         fieldName:'AccountUrl', //backend value
         type:'url',
         typeAttributes:{
            label:{
               fieldName:'accountName' //value looks on UI
            },
            target:'_blank',
            tooltip:'View Account'

         },
         sortable:true,
         initialWidth :150,
         hideDefaultActions:true,
         editable: true
      },
      {
         label:'Street', 
         fieldName:'street',
         sortable:true,
         initialWidth :220,
         wrapText:true,
         hideDefaultActions:true,
         editable: true
      },
      {
         label:'City', 
      fieldName:'city',
      sortable:true,
     
      hideDefaultActions:true,
      editable: true
      },
      {
         label:'Country', 
         fieldName:'country',
         sortable:true,
         
         hideDefaultActions:true,
         editable: true
      },
      {
         label:'Pin Code', 
         fieldName:'postalCode',
         sortable:true,
         
         hideDefaultActions:true,
         editable: true
      },
      //add another column which contains list of action.
      {
         type:'action',
         typeAttributes:{
            rowActions :this.dynamicAction, //build dynamic acton for each row 
            menuAlignment :'auto'
         }

      }
   ]

   /*
    connectedCallback will fetch data faster than wire in ORDER OF Execution.
    adding new atribute to the each contcat to suite the requirment of dataTable
   */
   connectedCallback()
   {
      this.updateTotalRecordCount(); //update the total record count variable.
      
   }
   // * Handle rowAction function 
   handleRowAction(event)
   {
      const actionName = event.detail?.action?.name;   //optional chaining..if the object accessed is null/undefined then expression short circuit evaluate to undefined 
      console.log(`actionName ${actionName}`);
      const row =event.detail?.row;
      console.log(JSON.stringify(row));

      switch(actionName){
         case 'view':
            console.log('view action clicked');
            break;
         case 'edit':
            console.log('edit button clicked');
            break;
         case 'delete':
            console.log('delete button clicked');
            //* logic to temporarily delete data from row
            const rows = this.employeeData;
            const rowIndex = rows.indexOf(row);
            console.log(rowIndex);
            rows.splice(rowIndex, 1);//delete 1 items of given rowIndex
            //shallow copy ..share the same reference in the memory 
            //spread syntax generate new array so re-render on UI takes place.
            //we may use deepclone as well but it's is not required here 
            //deep clone will take more memory /more time in execution as compare to shallow clone.
            this.employeeData = [...rows]; //we want each item of rows array copied to empdata
           //* deep copy ..attributes share different reference in the memory 
           // this.employeeData = JSON.parse(JSON.stringify(rows));


            break;
         default : 
         break 

      }

   }

   // * 
   sortBy(field, reverse, primer){
      
      //* key function return the value of attribute on whch sorting take place.
      //* each function accept a single contact object return value of specific field
      //* primer we use to do transform ..all character in upper case 
      //* primer wil accept the field value perform some logic on that then return . 
       const key =primer 
                  ? function(a)
                  {
                      return primer(field,a);
                  }
                  : 
                  function(a)
                  {
                     
                     return a[field];
                  };

      // * return comparable fun
       return function(a,b)
       {
         //a is object 
         //b is another adjacent record

         //once key called on a and b ...key function return  their particular field value.
          a = key(a);
          b = key(b);
         
          //based on it return -1, 1 ,0 
          /*
             -> valid for asc 
             > 0 means a should comes after b;
             < 0 means a should comes before b;
             = 0 means if order doesn't matter. 
          */

         //* handle undefined values while sorting.
         if(a === b)
             return 0;
         else if(a === undefined) 
            return reverse * -1; //undefined will come 1st in asc
         else if (b === undefined)
           return reverse * 1; //
         
          return reverse * ((a > b) - (b > a));
       }


   }
   //* helper method for sortby method
   primer(fieldName,record)
   {
      let retrunVal;
       switch (fieldName){
         case "contactUrl" : 
           retrunVal = record['Name'];
           break;
         case "AccountUrl" :
            retrunVal = record['accountName'];
            break;
         default:
            retrunVal = record[fieldName];
            break;

       }
       return retrunVal;
   }

   // * handle onsort function 
   handleSort(event)
   {
      console.log(event.detail);
      const {fieldName :sortedBy , sortDirection: SortedDirection} = event.detail;
      const clonedContacts = [...this.employeeData]; //shallow copy ..but 1st level it acts as deep copy.
      // sort function accept compareFn.
      console.log(`sortedBy : ${sortedBy} , sortedDirection :${SortedDirection}`);
      clonedContacts.sort(this.sortBy(sortedBy, SortedDirection === 'asc' ? 1 : -1,this.primer)); //no copy is made here same array got sorted.
      this.employeeData = clonedContacts; 
      this.sortedBy = sortedBy;
      this.SortedDirection = SortedDirection;

      }
   // * whenever header column action is clicked this function is called 
   handleHeaderAction(event)
   {
       console.log(JSON.stringify(event.detail));
       //event.detail gives cloumn defination and action which is clicked
       const {action ,columnDefinition} = event.detail;
       // get the cloumn and find the particular cloumn on which action is being performed.
       // once find the cloumn then get the list of all action associated with that coloumn.

       const column = this.employeeColumn;//all coloumn
       //get all the action of partilcular column ...looks for Json string to understand below statement.
       const columnAction = column.find(eachColumn => eachColumn.fieldName ===  columnDefinition.fieldName)?.actions; 
       // if the column action is find then tick the choosen action.
       if(columnAction)
       {
          columnAction.forEach(currentItem =>{
            //each item have checked Attribute
            //action comes from event just match and mark them to true.
             currentItem.checked = currentItem.name === action.name;
          })
          //due to limitation and known issue we need to assign the column with updated action 
          this.employeeColumn = [...column];
         if(action.name === 'all') //we don't need any filter to be passes so we delete the filter
         {
             //this.employeeData = this.originalEmployeeData;
             delete this.recordFilter[columnDefinition.fieldName];
             console.log('---record filter check inside all',JSON.stringify(this.recordFilter));
         }
         else // we need to apply filter.
         {
            console.log('---record filter check inside else',JSON.stringify(this.recordFilter));
          this.recordFilter[columnDefinition.fieldName] = action.label;
          //this.employeeData = this.originalEmployeeData.filter(eachContcat => eachContcat.LeadSource === action.label);
         }
         console.log('---record filter check', JSON.stringify(this.recordFilter));
         this.updateTotalRecordCount();

       }


      
   }
   //* Exceuted when the row is selected/dis-selected in LDT
   handleRowSelection(event)
   {
      console.log(JSON.stringify(event.detail));
      this.selectedRows = event.detail.selectedRows.map(contact => contact.Id);
      console.log(JSON.stringify(this.selectedRows));
      //write other logic to play with the recordID ..
      //open Modal /delete row /update rows
   }

   //* called when user scroll all the way down to ldt.
   loadMoreContacts(event)
   {
     console.log('Load more contacts');
     console.log(`dataTable length ${this.employeeData.length}----totalRecordCount ${this.totalNumberofRecord}`);
     if(this.employeeData.length < this.totalNumberofRecord)
     {
      
      this.QueryContact(false); //false -we don't want override ...simply fetch more and append to existing list OF LDT
     }
     else
     {
      event.target.enableinfiniteLoading =false;
        this.enableInfiniteLoading = false;
      console.log('Table loaded ');
     }
     

   }
  //* update total number of recordCount
  //* it is called via 2 ways either initial run or when a new filter is applied.
  //* in both the cases i wanna apply new list of contacts to be on UI.
  updateTotalRecordCount()
  {
   const that = this; //to maintain the same context 
   getContactCount({
      recordFilter :this.recordFilter
   })
   .then(data => 
      {
         that.totalNumberofRecord =data
         that.QueryContact(true);//true - it allow to show new data on UI.
      })
   .catch(error => console.log(error))
  }

   //* generic function to query contacts based limit and offSet
   QueryContact(overrideContact)
   {
      this.isLoading = true;
      //this carry the context ..during the callback context may change (becaue allback executed after some time
      //and after sometime this may chage)
      // to memorise the this ..assign this to some variable and use that only
      const that = this;// use that to maintain consistency in callback 
      console.log('---Querying contacts--');
      console.log(`--Qlimit ${this.recordsLimit} ---QueryOffset ${this.employeeData.length}--recordfilter 
       ${ JSON.stringify(this.recordFilter)}`);
      /* Qureying contacts from salesforce org and adding new attributes to suite datatable requirements */
      getContact({
         QLimit: this.recordsLimit, //query limit is 10
         queryOffSet: overrideContact? 0: this.employeeData.length, //offset is number of record loaded so due to offset sf skip those records.
         //initial this.employeeData = 0 ..sf won't skip query 10 record.  next time length is 10 
         //so offset become 10 and so sf skip 1st 10 and then Query.
         recordFilter :this.recordFilter
      })
      .then(Contacts => {
         Contacts.forEach(contact => {
            //added below 2 attributes to support the Url
            contact.contactUrl = '/'+contact.Id;
            //contact.AccountUrl= '/'+contact.Account?.Id;
            contact.AccountUrl= (contact.Account === undefined ? '':'/'+contact.Account.Id); 
            contact.accountName = contact.Account?.Name;
            contact.street = contact.MailingAddress?.street;
            contact.city = contact.MailingAddress?.city;
            contact.country = contact.MailingAddress?.country;
            contact.postalCode = contact.MailingAddress?.PostalCode;

         });
         console.log('Array from SF',Contacts);
          const selectRows = that.employeeData.length === 0;//return true if 1st time loading is happening in ldt.
          //concat is used to add new set of array to the alredy existing one
          //each time Contacts is 10 ...each 10 will be concatenated to the existing array.
         if(overrideContact)
         {
            that.employeeData = Contacts;
         }
         else
         {
            that.employeeData =  that.employeeData.concat(Contacts);
         }
          
         // that.originalEmployeeData = that.originalEmployeeData.concat(Contacts);
          //mark the 1st three row as selected by default.
          //we need to pass list of ID to ldt to mark those selected.
          console.log('--SR-'+selectRows);
          if(selectRows)
          {
            that.selectedRows= Contacts.slice(0,3).map(contact => contact.Id);
          }
          
          console.log('--default selected row--',JSON.stringify(this.selectedRows));
      })
      .catch(error => console.log(error))
      .then(()=>{
         that.isLoading = false;
      })
   }
// * called when inline edit is canceled
// * 
handleCancel(event)
{
  console.log(`cancel ${JSON.stringify(event.detail)}`);
  this.draftValues =[];
  this.removeCellattributes();
}

//* called when single or multiple cellUpdate takes place 
handleCellChange(event)
{
   console.log(`cell change ${JSON.stringify(event.detail)}`);
   //need to build the draftvalues by own 
   /*
    2 possibilities user can perfrom on UI while doing inline edit.
     * same record update in different set of action (A. phone update of same B. Email update of same c. Other details update of same record)
       ---> in this we have to to merge the object 
     * Brand new rows being editing from UI
       ---> Simply concat the brand new draftValue to existing collection
   */
  
   let draftValue = this.draftValues; //assign the whole draftValues to local
   const currentActionDraftValues = event.detail.draftValues; //it will gives array of changes made in current action
  // we need to apply customCell on each contact property 
  const employeeData = this.employeeData; 

   // code to apply cellAtttributes class in the cell
   for(let currentActionDraftValue of currentActionDraftValues)
   {
      
       //check weather the leadSource is updating or any other field
       if(currentActionDraftValue.hasOwnProperty('LeadSource'))
       {
         
         //serach for contact on which we need to apply custom cellAttributes like editCellCss
          const contactIndex = employeeData.findIndex(eachEmployeeData => eachEmployeeData.Id === currentActionDraftValue.Id );
          if(contactIndex > -1) //means value which is being edited is avaialble in the current Action
          {
         
             //Now apply the customProperety to contact record after doing necessary check
             if(!employeeData[contactIndex].hasOwnProperty('editCellCss')) //means if already Not applied 
             {
               
               //add new property ans their respected value.
               employeeData[contactIndex].editCellCss = 'slds-cell-edit slds-is-edited';
             }
          }
       }
   }
  
  
   //Now, we need to check weather currentAction chages record alredy available in draftValue or not
   draftValue = draftValue.map(eachdraftValue => {
   let currentActionIndex = currentActionDraftValues.findIndex(currentActionDraftValue => currentActionDraftValue.Id === eachdraftValue.Id)
   console.log('current found or not',currentActionIndex);
   if(currentActionIndex > -1) //assume in another action same record is being update can be determined via above statement.
   {
      //we need to merge so that if phone in one action ...Email in one updated both are reflected in draft value. 
      // same key is merged between the both the object ..herein it's Id
      const newDraftValue = {
         ...eachdraftValue,
         ...currentActionDraftValues[currentActionIndex]
      };
      console.log('new Draft before return',newDraftValue);
      currentActionDraftValues.splice(currentActionIndex,1); //after merege  simply remove the item 
      return newDraftValue;
   }
   else{  //simply return the other element if the element is not manupulated in the current action.
      return eachdraftValue;
   }
   
   });
   //data check before concat 
   console.log(`draft val ${draftValue} ---- currentActionDraftValues ${currentActionDraftValues}`);
   // every time if new record being update then simply add the draftchange 
   draftValue = draftValue.concat(currentActionDraftValues);
   //assign to component level 
   this.draftValues = draftValue;
   
   console.log('---final draft Value', JSON.stringify(this.draftValues));

}
//* called when save button clicked 
handleSave(event)
{
   console.log(`save  ${JSON.stringify(event.detail)}`);
   this.draftValues =[];
   this.removeCellattributes();
}

//* this function will enable inline edit from seperate event which occur outsite ldt
triggerInlineEdit(event)
{
  const ldt = this.template.querySelector('c-libs-datatable');
  ldt.openInlineEdit();
}
removeCellattributes()
{
   const data = this.employeeData;
   data.forEach(eachContact => delete eachContact.editCellCss)
}

/*
tracing :

arr1 = [
contact1 :{name : Gaurav, Email : kr@gmail.com, Phone : 3201111},
contact2 :{name : Victor, Email : vi@gmail.com, Phone : 9201111},
contact3 :{name : Fran, Email : Fran@gmail.com, Phone : 9201111}];

arr2 = [...arr1];
//got direction = asc and fieldName = Name 
arr2.sort() //sort() accept the compareFn

sortBy(Name ,1)
{
   const key =primer ? function(x)
                       {
                          return primer(x[Name]) //
                       } 
                       :
                       function(x)
                       {
                        return x[Name];
                       }

}






*/

/*
Filter dataTable ..with infinite loading enabled. complete story

change in Apex controller.

Allow methods to accept the filter parameter. 
filter parameter contains the where condition....

once filter change ...
calculate total numumber of record which that particular filter and 
load initial records only.

//
LWC is one way binding

assume datatable is child component
contcatDataTable is parent componet 
<c/contactDataTable> 
<ldt draftvalues>  </ldt>
</c/contactDataTable(alias cdt)

To communicate ...from cdt to ldt(P-child)simply update the property of ldt(draftValues) and it will affect in ldt

To communicate --from ldt to cdc ...we need to take help of event ..here 
event carry the information of draft value

same also happen in normal Lightning-input field.






*/ 


// this.employeedata =[...row];
//* shallow copy is a copy whose proprty share the same reference.


//* deep copy is a copy whose properties don't share the same reference. 
    



// to learn more about data types in table follow below links
// https://developer.salesforce.com/docs/component-library/bundle/lightning-datatable/documentation
    /* Modification 


    Details steps to create custom custom dataType in lightning dataTable.

    Step-1 : create a new LWC component with someName extends the LightningDatatable instead of LightningElement

    Step-2 : Define custom types in the new component(can be more than one as well)
             like below 
            static customTypes = {
               customPictureType(Any Relatable NameWe can give): { //this name refered
                         template: customPicture, // how it looks on cell of ldt 
                         standardCellLayout: true,
                        typeAttributes: ['pictureUrl']
                  }
                  //other we can add here

    Step-3 : replace the tag <lightning-datatable> from original component to step-1 component Name here (c-some-name)

    step-4 : column on which we want to apply ...custon cell looks ..we define column type --step2 custom type name

    step-5 : Important :
             suppose we need to pass some attributes 

    
   
*/
}
