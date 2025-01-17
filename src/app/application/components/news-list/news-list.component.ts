import { Component, Inject, OnDestroy, OnInit, Input, Output } from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { PageEvent } from "@angular/material/paginator";

import { NewsModel } from "../../models/application-news.model";
import { NewsService } from "../../services/application-news.service";

import { globalFunctions } from "../../../functions/global.function";

@Component({
  selector: 'app-application-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['../../../app.component.css','./news-list.component.css']
})
export class ApplicationNewsList implements OnInit, OnDestroy {
  toolbarTitle = "HABERLER";
  isLoading: boolean = false;
  newsList: NewsModel[] = [];
  private newsSub: Subscription;

  newsCount: number = 0;
  paginationPageSizeOptions: Array<number> = this.globalFunctions.getPaginationPageSizeOptions();
  paginationPageSize: number = this.paginationPageSizeOptions[0];
  paginationCurrentPage: number = 1;

  constructor(
    public newsService: NewsService,
    private router: Router,
    private globalFunctions: globalFunctions
    ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.globalFunctions.setToolbarTitle(this.toolbarTitle);
    this.newsService.getNews(this.paginationPageSize, this.paginationCurrentPage);
    this.newsSub = this.newsService.getNewsUpdateListener()
      .subscribe({
        next: (data: {newsList: NewsModel[], newsCount: number}) => {
          this.newsList = data.newsList.length > 0 ? data.newsList : [];
          this.newsCount = data.newsCount;
          this.isLoading = false;
        }
      });
  }

  getLocalDate(_date: Date): string {
    return this.globalFunctions.getLocalDate(_date);
  }

  showNewsDetails(_id: number) {
    this.router.navigate(['/haberler/detaylar', _id]);
  }

  onChangePaginationPage(paginationData: PageEvent){
    this.isLoading = true;
    this.paginationPageSize = paginationData.pageSize;
    this.paginationCurrentPage = paginationData.pageIndex + 1;
    this.newsService.getNews(this.paginationPageSize, this.paginationCurrentPage);
  }

  ngOnDestroy(): void {
    this.newsSub.unsubscribe();
  }
}
