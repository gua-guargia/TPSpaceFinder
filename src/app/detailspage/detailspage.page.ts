import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detailspage',
  templateUrl: './detailspage.page.html',
  styleUrls: ['./detailspage.page.scss'],
})
export class DetailspagePage implements OnInit {

  data: any;
 
  constructor(private route: ActivatedRoute, private router: Router) {
   this.route.queryParams.subscribe((res) => {
    this.data = JSON.parse(res.value);
});
  }
 
  ngOnInit() { }

}
