//* with sharing record level security is enforced.
public with sharing class contactApexController {
    
    @AuraEnabled
    public static list<Contact> getAllContact(Integer QLimit ,Integer queryOffSet, Map<String,String> recordFilter)
    {
       
      String query ='select Name ,Email ,LeadSource,Phone ,MailingAddress, Account.Name from Contact';
      query = addFilter(query,recordFilter);
      query += ' order by Name ASC LIMIT '+ QLimit +' OFFSET '+ queryOffSet;
      return database.query(query);
        
      
    }
    @AuraEnabled
    public static Integer getContactCount(Map<String,String> recordFilter){
        string query ='Select count() from Contact';
        query = addFilter(query,recordFilter);
        return Database.countquery(query);
    }

    static String addFilter(String query, Map<String,String> recordFilter)  // phone , 9845584621 
    {
      if(recordFilter!=null && !recordFilter.isEmpty())
      {
        query += ' Where ';   
        for(String fieldName : recordFilter.keySet())
        {
          query += fieldName +' = \''+String.escapeSingleQuotes(recordFilter.get(fieldName)) + '\' AND ';
        }
        query =query.removeEnd(' AND ');
       
      }
      return query;
    }
}