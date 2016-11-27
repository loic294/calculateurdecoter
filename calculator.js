class CalculCoteR {

  constructor (note, moyenne, ecartType, moyenneSecondaire) {
    this._note = (typeof note == 'string' ? parseFloat(note.replace(',', '.')) : note);
    this._moyenne =  (typeof moyenne == 'string' ? parseFloat(moyenne.replace(',', '.')) : moyenne);
    this._ecartType =  (typeof ecartType == 'string' ? parseFloat(ecartType.replace(',', '.')) : ecartType);
    this._moyenneSecondaire =  (typeof moyenneSecondaire == 'string' ? parseFloat(moyenneSecondaire.replace(',', '.')) : moyenneSecondaire);
  }

  // La cote Z d’un élève n’est rien d’autre que l’écart entre sa propre note( ) et la moyenne du groupe ( ), divisé par l’écart-type ( ).
  _CoteZ() {
    return ( (this._note - this._moyenne) / (this._ecartType ? this._ecartType : 1) );
  }

  //IFG = (moyenne des notes des cours obligatoires en secondaire IV et V des étudiants du cours-groupe - 75) ÷ 14
  _IFG() {
    const IFG = (this._moyenneSecondaire - 75) / 14;
    if(IFG >= 1.7857) { return 1.7857; }
    return IFG;
  }

 // \displaystyle CRC_{\text{cours}}=(Z+IFG+C)\cdot D
  _CRC(coteZ, IFG) {
    return (coteZ + IFG + 5) * 5;
  }

  getCote () {
    const CRC = this._CRC(this._CoteZ(), this._IFG());
    var coteReturn =  Math.round(CRC * 1000) / 1000 ;
    return (isNaN(coteReturn) ? '0' : coteReturn) ;
  }

}

class CoteRGlobale {

  constructor(all) {
    this._all = all;
    this._globalRScrore = 0;
    this._sommeRScore = 0;
    this._sommeCotePonderee = 0;
    this._sommeUnites = 0;
    this._create(this._all);
  }

  _create(rScores) {
  
    this._all = rScores.map((d,index)=>{
      let newRScore = new CalculCoteR(d.note, d.moyenne, d.ecartType, d.moyenneSecondaire);
      this._sommeRScore += newRScore.getCote();
      this._sommeCotePonderee += newRScore.getCote() * (d.note > 59 ? d.unites : (d.premierSession ? d.unites * 0.25 : d.unites *0.50) );
      this._sommeUnites += parseFloat(d.unites);
      d.rscore = newRScore.getCote();
      d.coule = d.note < 60;
      d.ponderation = (d.premiereSession ? 0.25 : 0.50);
      return d;
    });
  }

  all() {
    return this._all;
  }

  getCoteGlobale() {
    var coteReturn = Math.round((this._sommeCotePonderee / this._sommeUnites) * 1000) / 1000;
    return (isNaN(coteReturn) ? '0' : coteReturn) ;
  }

}
