/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { IresponseTest1, IcreateFormDTO, IupdateFormDTO } from '@commons/interfaces/test1.interface';
import { Test1Query } from './test1.query';
import { Test1Service } from './test1.service';
import { Test1State } from './test1.store';
import { ModalController } from '@ionic/angular';
import { Test1Modal } from './test1-modal/test1-modal.component';


@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'test1',
  templateUrl: './test1.page.html',
})
export class Test1Page implements OnInit {

  test1ToBeUpdated: IresponseTest1;
  isUpdateActivated = false;

  test1ToBeCreated: IresponseTest1; 
  isCreateActivated: boolean;

  listTest1sSub: Subscription;
  updateTest1Sub: Subscription;
  deleteTest1Sub: Subscription;
  createTest1Sub: Subscription;


  cstate: Test1State;

  test1s$: Observable<IresponseTest1[]> = this.test1Query.selectAll();

  dataReturned: any;

  constructor(
    private test1Service: Test1Service,
    private test1Query: Test1Query,
    public modalController: ModalController
    ) {
  }

 // -- Modal
  async openModal() {
    const modal = await this.modalController.create({
      component: Test1Modal,
      // componentProps: {
      //   // eslint-disable-next-line quote-props
      //   'paramID': 123,
      //   // eslint-disable-next-line quote-props
      //   'paramTitle': 'Test Title'
      // }
    });

    // modal.onDidDismiss().then((dataReturned) => {
    //   if (dataReturned !== null) {
    //     this.dataReturned = dataReturned.data;
    //     //alert('Modal Sent Data :'+ dataReturned);
    //   }
    // });

    return await modal.present();
  }

  // -- end modal

  ngOnInit() {
    this.listTest1sSub = this.test1Query.selectAreTest1sLoaded$.pipe(
      filter(areTest1sLoaded => !areTest1sLoaded),
      switchMap(areTest1sLoaded => {
        if (!areTest1sLoaded) {
          return this.test1Service.getAllTest1s();
        }
      })
    ).subscribe(result => {});
  }

  showCreateForm() {
    this.isCreateActivated = true;
  }

  showUpdateForm(test1: IresponseTest1) {
    this.test1ToBeUpdated = {...test1};
    this.isUpdateActivated = true;
  }

  updateTest1(updateForm) {
    console.log(updateForm.value);
    console.log(updateForm.value.campo2);
    this.updateTest1Sub = this.test1Service.updateTest1(
      this.test1ToBeUpdated.id, updateForm.value).subscribe(result => console.log(result)
    );
    this.isUpdateActivated = false;
    this.test1ToBeUpdated = null;
  }

  createTest1(createForm) {
    console.log(createForm.value.campo1);
    console.log(createForm.value.campo2);
    this.createTest1Sub = this.test1Service.createTest1(createForm).subscribe(result => {
      console.log(result);
    });
    this.isCreateActivated = false;
    this.test1ToBeCreated = null;
  }

  deleteTest1(test1Id: number) {
    this.deleteTest1Sub = this.test1Service.deleteTest1(test1Id).subscribe(result => {
      console.log(result);
    });
  }

  ngOnDestroy() {
    if (this.listTest1sSub) {
      this.listTest1sSub.unsubscribe();
    }

    if (this.deleteTest1Sub) {
      this.deleteTest1Sub.unsubscribe();
    }

    if (this.updateTest1Sub) {
      this.updateTest1Sub.unsubscribe();
    }
  }



}
