public with sharing class contactApexController {
    
    @AuraEnabled
    public static list<Contact> getAllContact()
    {
        return [select Name ,Email ,Phone ,MailingAddress, Account.Name from Contact];
    }
}