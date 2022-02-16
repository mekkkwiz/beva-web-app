import React, { Component } from "react";
import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import { Dialogflow_V2 } from "react-native-dialogflow";

import BevaApiCredentials from './beva-api-59b08e41e3d1.json'; 
class App extends Component {
  constructor(props) {
    super(props);
    Dialogflow_V2.setConfiguration(
      BevaApiCredentials.client_email,
      BevaApiCredentials.private_key,
      Dialogflow_V2.LANG_THAI,
      BevaApiCredentials.project_id
    );

    this.state = {
      recordState: null,
    };
  }

  start = () => {
    this.setState({
      recordState: RecordState.START,
    });
  };

  stop = () => {
    this.setState({
      recordState: RecordState.STOP,
    });
  };

  //audioData contains blob and blobUrl
  onStop = (audioData) => {
    console.log("audioData", audioData);
    console.log(BevaApiCredentials)
  };

  render() {
    const { recordState } = this.state;

    return (
      <div>
        <AudioReactRecorder state={recordState} onStop={this.onStop} />

        <button onClick={this.start}>Start</button>
        <button onClick={this.stop}>Stop</button>
      </div>
    );
  }
}

export default App;
