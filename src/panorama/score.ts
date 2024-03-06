let scoreValue = $("#ScoreValue") as LabelPanel;

GameEvents.Subscribe("on_score_changed", (data: NetworkedData<OnScoreChangedEventData>) => {
    
    scoreValue.text = data.score.toString();

    $.Msg("Score: ", data.score);

});