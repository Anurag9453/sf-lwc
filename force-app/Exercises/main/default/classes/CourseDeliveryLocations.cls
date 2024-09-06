public with sharing class CourseDeliveryLocations {
  
    @AuraEnabled(cacheable=true)
    public static List<AggregateResult> getLocations(){
        return [SELECT Location__c, COUNT(Id) numDeliveries FROM Course_Delivery__c WHERE Location__c != null WITH SECURITY_ENFORCED GROUP BY Location__c];
    }
    public List<AggregateResult> locationsVF{
        get{
            if(locationsVF==null){
                locationsVF = CourseDeliveryLocations.getLocations();
            }
            return locationsVF;
        }private set;
    }
}