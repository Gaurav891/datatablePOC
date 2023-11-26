//* with sharing record level security is enforced.
public with sharing class contactApexController {
    
    @AuraEnabled
    public static list<Contact> getAllContact(Integer QLimit ,Integer queryOffSet)
    {
       
        // * return the list of contact sorted by Name in asc order.
        return [select Name ,Email ,LeadSource,Phone ,MailingAddress, Account.Name from Contact
                  order by Name ASC LIMIT :QLimit OFFSET: queryOffSet];
    }
    @AuraEnabled
    public static Integer getContactCount(){
       return [select count() from Contact];
    }
}