import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { apiEndpoint } from '@group8/api-interfaces';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'group8-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  @Input()
    requiredFileType:string;
  @Input()
    endpoint:string;

    fileName = '';
    uploadProgress:number;
    uploadSub: Subscription;
    resData

    constructor(private http: HttpClient,
                public alertController: AlertController) {}

    onFileSelected(event) {
        const file:File = event.target.files[0];
        console.log(this.endpoint);
      
        if (file) {
            this.fileName = file.name;
            const formData = new FormData();
            formData.append("file", file);

            const upload$ = this.http.post(apiEndpoint + this.endpoint, formData, {
                reportProgress: true,
                observe: 'events'
            })
            .pipe(
                finalize(() => this.reset())
            );
          try {
            this.uploadSub = upload$.subscribe(event => {
              if (event.type == HttpEventType.UploadProgress) {
                this.uploadProgress = Math.round(100 * (event.loaded / event.total));
              } 
              else {
                console.log("event:")
                // if (typeof event !== 'undefined' && event) {
                //   console.log(event["headers"].status);
                // }
                // this.presentAlert()
                
                this.resData = event
                console.log(this.resData)
              }
              
            })
          } catch (error) {
            console.log("eeeeerrrrooorrrr")
          }
        }
    }

  cancelUpload() {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Upload Failed',
      message: 'Something went wrong while uploading your file. Please try again. Make sure your file is in the right format.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
