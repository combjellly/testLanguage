String.prototype.encodeHex = function () {
    return this.split('').map(e => e.charCodeAt())
};

let autoTextBlock = "";

let title = "ALIEN ALPHABET GENERATOR";
let instr01 = "Type to create an encoded message.";
let instr02 = "";
let instr03 = "Press the period key 5 times to clear.";

let instr05 = "Click the button below for auto mode.";
let instr06 = "This piece works best in auto mode on mobile devices.";
let resetString = ".....";

let marginW = 30;
let marginH = 30;
let padding = 5;
let e;
let instruction_e;

let typeBuffer = [];
let userString = "";
let charactersPerSymbol = 7;
let typeBufferMax = 175;
let textH = 400; // where the text goes when somebody types

let offsetAngles = [];

let ignoreKeys; 
let flashred = false;
let columns = 5;
let rows = 5;
let symbolSpace = 110;
let lastTyped = 0;
let showInstructions = true;

let autoStringIndex = 0;
let autoWaitTimerActive = false;
let autoWaitTimer = 0;
let autoStringBuffer = [];

let autoStartCountdown = 150;

let autoMode = false; // is the sketch running itself?

function setup() {
  createCanvas(windowWidth, windowHeight);
  calcDimensions();

  background(255);
  textAlign(CENTER);
  randomSeed(3);
  
  autoTextBlock = makeText(3000);
  
  for (let i = 0; i < 250; i++){
    offsetAngles.push(parseInt(random(6)) * 60);
  }
  ignoreKeys = [ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, 
                ALT, UP_ARROW, DOWN_ARROW, LEFT_ARROW];
  
  // Initializing
  userString = "";
  setString("");
  instruction_e = new Encoder(makeText(21));
}

function draw() {
  background(255);
  
  if(!autoMode && !showInstructions){
    frameRate(30);
    drawTheCode();
  } else if (showInstructions){
    frameRate(30);
    autoStartCountdown -= 1;
    if (autoStartCountdown == 0){
      autoMode = true;
      showInstructions = false;
    }
    instructions();
  } else if (autoMode){
    frameRate(14);
    if (autoStringIndex == 0){
      userString = "";
      autoStringBuffer = autoTextBlock.split();
    }
    if (autoStringIndex < typeBufferMax){      
      let letter = autoStringBuffer[0][autoStringIndex]
      typeBuffer.push(letter)
      userString = typeBuffer.join("");
      setString(userString);
      autoStringIndex += 1;
      drawTheCode();
      
      if(autoStringIndex == typeBufferMax){
        // start the wait timer
        autoWaitTimerActive = true;
      }
    } else {
      // update so not using the same auto text. Switch to the next text.
      // wait first thought
      if (autoWaitTimerActive){
        if (autoWaitTimer < 50){
          autoWaitTimer += 1;
          drawTheCode();
        } else {
          autoStringIndex = 0
          autoTextBlock = makeText(3000);
          autoWaitTimerActive = false;
          autoWaitTimer = 0;
          typeBuffer = [];
          userString = "";
        }
      }
    }
  }

  // Display what the user typed
  let typeLag = frameCount - lastTyped;
  if (!autoMode && !showInstructions && typeBuffer.length > 0 && typeLag < 300){
    noStroke();
    fill(0);
    let lagText = "(" + floor((300-typeLag)/10).toString() + ") ";
    if (autoMode){
      lagText = "";
      lastTyped = frameCount;
    }
    text(lagText + typeBuffer.join("").slice(0, typeBufferMax), width*0.05, textH, width*0.9);
    text("Press . (period) 5 times to clear. Press Right Arrow to start auto mode.", width*0.05, height - 60, width*0.9);
  }
}

function makeText(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.!@#$%^&*()?.<>';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function drawTheCode(){
  e.displayCode();
}

function instructions(){
  textSize(22);
  fill(255, 0, 0);
  text(title, width/2, height/4);
  textSize(14);
  text(instr06, width/2, height/4 + 30);
  fill(0);
  text(instr01, width/2, height/4 + 60);
  text(instr02, width/2, height/4 + 80);
  text(instr03, width/2, height/4 + 100);
  text("Autoplay starts in " + parseInt((autoStartCountdown / 10)).toString(), width/2, height/4 + 160);
  push();
  translate(0,100);
  instruction_e.displayCode();
  pop();
}

function calcDimensions(){
  columns = parseInt(windowWidth / symbolSpace); //min(12, parseInt(windowWidth / symbolSpace));
  rows = parseInt(windowHeight / symbolSpace); //min(12, parseInt(windowHeight / symbolSpace));
  typeBufferMax = charactersPerSymbol * columns * rows;
  marginW = max(30, (windowWidth - (symbolSpace*columns)) / 2);
  marginH = max(30, (windowHeight - (symbolSpace*rows)) / 2);
}

function setString(str){
  let substring = str.slice(0, typeBufferMax);
  let f = new Encoder(substring);
  e = f;
}

function keyPressed(){
  if (keyCode == RIGHT_ARROW) {
    // start auto mode
    autoMode = true;
    typeBuffer = [];
    return;
  }
  
  if(autoMode){
    userString = typeBuffer.join("");
    typeBuffer = [];
  }
  
  lastTyped = frameCount;
  showInstructions = false;
  autoMode = false;
  autoWaitTimer = 0;
  autoWaitTimerActive = false;
  
  
  if (keyCode == BACKSPACE || keyCode == DELETE){
    typeBuffer.pop()
  } else if (ignoreKeys.includes(keyCode) || keyCode == 91){
    // do nothing
  } else {
    typeBuffer.push(key);
  }
  
  // Check buffer: if last 5 are spaces, then reset.
  let lastChars = typeBuffer.slice(Math.max(typeBuffer.length - 5, 0)).join("");
  if (lastChars.localeCompare(resetString) == 0){
    reset(true);
  }
  
  userString = typeBuffer.join("");
  setString(userString);
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
  if(autoMode){
    reset(true);
  } else {
    reset(false);
  }
}

function reset(clearBuffer){
  calcDimensions();
  if (clearBuffer || autoMode){
    userString = "";
    typeBuffer = [];
    lastTyped = 0;
    if (autoMode){
      autoStringIndex = 0
      autoTextBlock = makeText(3000);
      autoWaitTimerActive = false;
      autoWaitTimer = 0;
    }
  }
  setString(userString);
}

class Encoder {
  constructor(_toEncode){
    this.symbolDiam = 100;
    this.letterGroupings = [];
    this.encodedString = _toEncode;
    this.encode();
    this.positions = [];
  }
  
  createGrid(){
    // Keep this all internal.
    let activeDiagrams = this.letterGroupings.length;
    let gridRows = rows;
    let gridColumns = columns;
    
    gridRows = max(1, ceil(activeDiagrams / columns));
    if (gridRows > rows){
      gridRows = rows;
    }
    
    gridColumns = min(max(1, activeDiagrams), columns);
    if (gridColumns > columns){
      gridColumns = columns;
    }
    // All good above here
    
    
    let totalGridWidth = gridColumns * symbolSpace + (2*marginW);
    let totalGridHeight = gridRows * symbolSpace + (2*marginH);
  
    let gridOffsetX = (width - totalGridWidth) * 0.5;
    let gridOffsetY = (height - totalGridHeight) * 0.5;
    
    this.positions = this.gridRep();
    
    let activeDiagramsCounter = 1;
    for (let i = 0; i < this.positions.length; i++){ // rows
      for (let j = 0; j < this.positions[i].length; j++){ // columns
        if (activeDiagramsCounter <= activeDiagrams){
          this.positions[i][j] = activeDiagramsCounter;
          activeDiagramsCounter += 1;
        } else {
          break;
        }
      }
    }
    
    // console.log(this.positions);
    let tempPositions = [];
    
    // Create an array that let's us know how many elements are in each row.
    // Refer to it to populate positions
    for (let i = 0; i < this.positions.length; i++){
      // deal with one row at a time.
      let row = this.positions[i];
      let elements = row.filter(function (el) { return el != null }).length;
      tempPositions.push(elements);
    }
    
    for (let i = 0; i < tempPositions.length; i++){
      let rowElements = tempPositions[i];
      let posRow = this.positions[i];
      let newPosRow = [];
      
      // We know that i is the row number
      // We know that rowElements is the number of columns in the row
      
      // Calculate the Y position
      let yPos = gridOffsetY + marginH + 0.5*symbolSpace + i*symbolSpace;
      
      // Calculate the X positions
      let rowWidth = rowElements * symbolSpace + marginW * 2;
      let rowOffsetX = (width - rowWidth) * 0.5;
      
      for (let j = 0; j < rowElements; j++){
        let xPos = marginW + 0.5*symbolSpace + j*symbolSpace + rowOffsetX;
        let v = createVector(xPos, yPos);
        newPosRow.push(v)
      }
      this.positions[i] = newPosRow;
    }
    
    // Text when somebody is typing - not used in this class
    textH = gridOffsetY + totalGridHeight - marginH + 10;    
  }
  
  gridRep(){
    let numGrps = this.letterGroupings.length;
    let maxCols = columns;
    let maxRows = rows;
    
    let rep = [];
    while (rep.length < maxRows){
      let r = [];
      while (r.length < maxCols){
        r.push(null);
      }
      rep.push(r)
    }

    return rep
  }

  
  displayCode() {
    // this.gridRep();
    this.createGrid();
    
    for (let i = 0; i < this.letterGroupings.length; i++){
      let loc = this.positions.flat()[i];
      // console.log("draw index: " + i + ", loc: " + loc.x + ", " + loc.y);

      let lg = this.letterGroupings[i];
      push();
      translate(loc.x, loc.y);
      lg.displayGrouping(this.symbolDiam);
      pop();
    }
  }
  
  
  
  // This is all good
  encode(){
    let chars = Array.from(this.encodedString);
    let currentIndex = 0;
    
    while (currentIndex < chars.length) {
      let numLettersInGrouping = 7;
      numLettersInGrouping     = min(chars.length - currentIndex, numLettersInGrouping);
      let charsForGrouping     = [];

      for (let i = 0; i < numLettersInGrouping; i++) {
        charsForGrouping[i] = chars[currentIndex + i];
      }
      currentIndex += numLettersInGrouping;
      
      // Store the grouping
      let oA = offsetAngles[this.letterGroupings.length];
      let lg = new LetterGrouping(charsForGrouping, oA);
      this.letterGroupings.push(lg);
    }
  }
}











// Leave this alone!
class LetterGrouping {
  constructor(_letters, _offsetangle) {
    this.angles = [];
    this.letters = _letters;
    this.offsetAngle = _offsetangle;
    this.offsetAngleMax = 18;

    this.offsetAngle  = _offsetangle; //parseInt(random(6)) * 60;
    this.encodeGrouping();
  }
  
  displayGrouping(outerDiameter){
    // Offset
    strokeWeight(max(min(outerDiameter/10.0,2),1));
    strokeCap(SQUARE);
    stroke(255,0,0);
    noFill();
    let arcStart = radians(this.offsetAngle - 30);
    let arcEnd   = radians(this.offsetAngle + 30);
    arc(0,0,outerDiameter,outerDiameter,arcStart,arcEnd);
    
    let diamStep = (outerDiameter / this.angles.length + 1) *0.6;
    
    fill(0,20);
    stroke(0);
    // Draw from the outside in
    for (let i = this.angles.length-1; i >= 0; i--){
      let angle = this.angles[i];
      arcStart = radians(angle.x);
      arcEnd   = radians(angle.y);
      let diamDiff = diamStep * (this.angles.length - i); 
      let diam = outerDiameter - diamDiff;
      arc(0,0,diam,diam,arcStart,arcEnd);
    }

  }

  encodeGrouping() {

    for (let i = 0; i < this.letters.length; i++) {
      let charAsByte  = this.letters[i].encodeHex()[0];
      let byteAsHex = charAsByte.toString(16);

      // Now we should have a two char string. Could be more?
      let hexStringChars = Array.from(byteAsHex);

      // Convert those chars to angle stops
      let charAngleStart = this.getAngleStopForChar(hexStringChars[0]);
      let charAngleStop  = this.getAngleStopForChar(hexStringChars[1]);

      // The angles are additive for display, so the domain is 1-32
      let startAngle = map(charAngleStart,1, this.offsetAngleMax,0,360) + this.offsetAngle;
      let stopAngle  = map(charAngleStart + charAngleStop,1, this.offsetAngleMax,0,360) + this.offsetAngle;
      
      let anglesForChar = createVector(startAngle,stopAngle);
      this.angles.push(anglesForChar);
    }
  }

  getAngleStopForChar(c) {
    if (c == 'A') {
      return 11;
    } else if (c == 'B') {
      return 12;
    } else if (c == 'C') {
      return 13;
    } else if (c == 'D') {
      return 14;
    } else if (c == 'E') {
      return 15;
    } else if (c == 'F') {
      return 16;
    } else {
      // convert to int and add one
      return parseInt("" + c) + 1;
    }
  }
}
