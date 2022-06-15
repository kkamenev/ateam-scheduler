

export function sendMail(emailAddress: string): Promise<any> {
  return new Promise(resolve => {
    console.log(`Sending mail to ${emailAddress}`);
    setTimeout(() => {
      console.log(`Sent mail to ${emailAddress}`);
      resolve(undefined);
    }, 100)
  });
}

export function syncData(): Promise<any> {
  return new Promise((resolve, reject) => {
    console.log(`Syncing data`);
    reject('Data sync failed');
  });
}
