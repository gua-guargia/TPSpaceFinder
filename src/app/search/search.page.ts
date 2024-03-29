import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { first } from 'rxjs/operators';
import { DataService } from '../services/data.service';
import { Router, NavigationExtras} from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  public locationList: any[];

  constructor(
    private navCtrl: NavController,
    private router: Router, 
    private dataService: DataService,
    private firestore: AngularFirestore) { }

  async ngOnInit() {
    this.locationList = await this.initializeItems();
  }
  
  navigateToDetails(locationItem) {
    this.router.navigate(['detailspage'], {
      queryParams: {
        value: JSON.stringify(locationItem)
      }
    });
  }

  async initializeItems(): Promise<any> {
    const locationList = await this.firestore.collection('Locations')
      .valueChanges().pipe(first()).toPromise();
    return locationList;
  }

  async filterList(evt) {
    this.locationList = await this.initializeItems();
    const searchTerm = evt.srcElement.value;
  
    if (!searchTerm) {
      return;
    }
  
    this.locationList = this.locationList.filter(currentLocation => {
      if (currentLocation.name && searchTerm) {
        return (currentLocation.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  back(){
    this.navCtrl.navigateRoot('/dashboard');
  }

}
