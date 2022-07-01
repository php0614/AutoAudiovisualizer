////////////////Band Seperated Envelope Follower using Tone.js//////////////////
///////////////////////////Philip Liu, 2022/////////////////////////////////////

//Tone.js needs to be imported

//when clicked, play the init() func
document.getElementById("play").onclick = init;

let outputLevel;
//Meters (audio to number) (for low, mid, and high respectively)
const meterL = new Tone.DCMeter(); const meterM = new Tone.DCMeter(); const meterH = new Tone.DCMeter();
//Envelope Followers (for low, mid, and high respectively)
//adjust the three float values if needed. if one of the number is increased, it means more smoothing, and it'll result in smoother change in visual as well.
const followerL = new Tone.Follower([0.15]); const followerM = new Tone.Follower([0.07]); const followerH = new Tone.Follower([0.02]);
//Filters to seperate frequencies. Mid freqency to be refined with a combination of L+H oppsite(from the original) frequency filter
const filterL = new Tone.Filter(300, "lowpass"); const filterH = new Tone.Filter(2000, "highpass");
const filterL_Opp = new Tone.Filter(300, "highpass"); const filterH_Opp = new Tone.Filter(2000, "lowpass");

//audio file player
let player = new Tone.Player("audio/bp.mp3");

//these three values are the FINAL OUTPUT VALUES to be used in a visualization system, etc.
let envF_Out_low, envF_Out_mid, envF_Out_high;


//update envelope follower Values
function updateLevel(){
    envF_Out_low = meterL.getValue();
    envF_Out_mid = meterM.getValue();
    envF_Out_high = meterH.getValue();

    //always disable when not debugging
    //console.log(envF_Out_low);
    //console.log(envF_Out_mid);
    //console.log(envF_Out_high);
}


function init(){
    Tone.start();

    //Envelope Follower Audio Stream 1 - low Frequency
    player.connect(filterL);
    filterL.connect(followerL);
    followerL.connect(meterL);

    //Envelope Follower Audio Stream 2 - mid Frequency
    player.connect(filterL);
    filterL_Opp.connect(filterH_Opp);
    filterH_Opp.connect(followerM);
    followerM.connect(meterM);

    //Envelope Follower Audio Stream 3 - high Frequency
    player.connect(filterH);
    filterH.connect(followerH);
    followerH.connect(meterH);

    //Direct Audio(for listening) stream
    player.connect(Tone.Master);


    player.sync().start(0);


    setInterval(updateLevel,16)

    Tone.Transport.start();

}


//export to modules.js so that these data can be delivered to the visualization part, etc.
export {envF_Out_low, envF_Out_mid, envF_Out_high};
