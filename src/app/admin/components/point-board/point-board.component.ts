import { Component, OnInit, OnDestroy, Input } from "@angular/core";
import { Subscription } from 'rxjs';

import { TeamsInGroupstagesModel } from "../../models/admin-teams-in-groupstages.model";
import { TeamsInGroupstagesService } from "../../services/admin-teams-in-groupstages.service";

import { PointBoardModel } from "../../models/admin-pointboard.model";
import { PointBoardService } from "../../services/admin-pointboard.service";

import { globalFunctions } from "../../../functions/global.function";
import { fontAwesomeIconList } from "../../../assets/lists/font-awesome-icon.list";

@Component({
  selector: 'app-admin-point-board',
  templateUrl: './point-board.component.html',
  styleUrls: ['../../../app.component.css', './point-board.component.css']
})
export class AdminPointBoard implements OnInit, OnDestroy {
  toolbarTitle = "PUAN TABLOSU";
  isLoading: boolean = false;
  teamsingroupstageList: TeamsInGroupstagesModel[] = [];
  private teamsingroupstageListSub: Subscription;
  expelledOrRecededTeamsInGroupstageList: TeamsInGroupstagesModel[] = [];
  pointBoardList: PointBoardModel[] = [];
  private pointBoardListSub: Subscription;

  fontAwesomeIconList = fontAwesomeIconList;
  tableColumnsPointBoard: string[] = [
                                      "order",
                                      "team",
                                      "played",
                                      "win",
                                      "draw",
                                      "lose",
                                      "goalScored",
                                      "goalConceded",
                                      "goalAverage",
                                      "totalPoints"
                                    ];

  constructor(
    private teamsingroupstageService: TeamsInGroupstagesService,
    private pointboardService: PointBoardService,
    private globalFunctions: globalFunctions,
  ) {}

  ngOnInit(): void {
    this.teamsingroupstageListSub = this.teamsingroupstageService.getTeamsInGroupstagesUpdateListener()
      .subscribe({
        next: (data: TeamsInGroupstagesModel[]) => {
          if (data.length > 0) {
            this.teamsingroupstageList = data;
            this.expelledOrRecededTeamsInGroupstageList = this.teamsingroupstageList.filter(t => !!t.isExpelled || !!t.isReceded);
          } else {
            this.teamsingroupstageList = [];
          }

        },
        error: (error) => {

        }
      });

    this.pointBoardListSub = this.pointboardService.getPointBoardUpdateListener()
      .subscribe({
        next: (data: PointBoardModel[]) => {
          this.pointBoardList = data;
        },
        error: (error) => {

        }
      });

  }

  findExpelledOrRecededTeam(_teamId: number): boolean {
    let team = this.expelledOrRecededTeamsInGroupstageList.find(team => team.teamId == _teamId);
    return !!team;
  }

  findExpelledOrRecededExplanation(_teamId: number): string {
    let team = this.expelledOrRecededTeamsInGroupstageList.find(team => team.teamId == _teamId);
    return !!team ? team.explanation : '';
  }

  ngOnDestroy(): void {
    this.pointBoardListSub.unsubscribe();
    this.teamsingroupstageListSub.unsubscribe();
  }
}
