export class PolicyDetails {
    constructor(policyData){
        this.groupId = policyData.groupId;
        this.usb = policyData.usb;
        this.mtp = policyData.mtp;
        this.printing = policyData.printing;
        this.browserUpload = policyData.browserUpload;
        this.bluetooth = policyData.bluetooth;
        this.clipboard = policyData.clipboard;
        this.blockedApps = policyData.blockedApps;
    }
}