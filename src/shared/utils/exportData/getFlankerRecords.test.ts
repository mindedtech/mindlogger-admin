import { getFlankerRecords } from './getFlankerRecords';

const practiceFlankerResponses = [
  {
    duration: 3002.5999999940395,
    offset: 1689604769751.7,
    question:
      '<div class="mindlogger-fixation"><img src="https://media-dev.cmiml.net/mindlogger/391962851007982489/50635b4f-7457-4677-9d2d-99132189eba2/5.jpg" alt="5.jpg"></div>',
    response_touch_timestamp: 1689604773046.6,
    start_time: 292.30000000447035,
    start_timestamp: 1689604770044,
    tag: 'fixation',
    trial_index: 1,
  },
  {
    button_pressed: '1',
    correct: false,
    duration: 1220.5999999940395,
    offset: 1689604769752.7,
    question:
      '<img src="https://media-dev.cmiml.net/mindlogger/391962851007982489/62e876f7-3144-4774-aaf1-aaf1ed3001eb/6.jpg" alt="6.jpg">',
    response_touch_timestamp: 1689604774279.6,
    start_time: 3306.8000000044703,
    start_timestamp: 1689604773059,
    tag: 'trial',
    trial_index: 1,
  },
];
const practiceItem = {
  question: '',
  responseType: 'flanker',
  responseValues: null,
  config: {
    stimulusTrials: [
      {
        id: '1c60f5cb-3668-49ef-b2be-c68643aa4ca1',
        image:
          'https://media-dev.cmiml.net/mindlogger/391962851007982489/62e876f7-3144-4774-aaf1-aaf1ed3001eb/6.jpg',
        text: '6.jpg',
        value: 0,
        weight: null,
      },
    ],
    blocks: [
      {
        name: 'Block 1',
        order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
      },
      {
        name: 'Block 2',
        order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
      },
      {
        name: 'Block 3',
        order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
      },
      {
        name: 'Block 4',
        order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
      },
    ],
    buttons: [
      {
        text: 'L_btn',
        image: '',
        value: 0,
      },
      {
        text: 'R_btn',
        image: '',
        value: 1,
      },
    ],
    nextButton: 'OK',
    fixationDuration: 3000,
    fixationScreen: {
      value: '5.jpg',
      image:
        'https://media-dev.cmiml.net/mindlogger/391962851007982489/50635b4f-7457-4677-9d2d-99132189eba2/5.jpg',
    },
    minimumAccuracy: 75,
    sampleSize: 1,
    samplingMethod: 'randomize-order',
    showFeedback: true,
    showFixation: true,
    showResults: true,
    trialDuration: 3000,
    isLastPractice: false,
    isFirstPractice: true,
    isLastTest: false,
    blockType: 'practice',
  },
  name: 'Flanker_Practice_1',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: false,
  id: 'a64df283-838f-44cc-adf9-be438c0597dc',
};
const practiceResult = [
  {
    block_number: 0,
    block_start_timestamp: '1689604770.044',
    event_offset: '0.000',
    event_start_timestamp: '1689604770.044',
    event_type: 'Fixation',
    experiment_start_timestamp: '1689604761.000',
    failed_practices: '1',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: 1,
    trial_offset: '0.000',
    trial_start_timestamp: '1689604770.044',
    trial_type: '6.jpg',
    video_display_request_timestamp: '1689604770.044',
  },
  {
    block_number: 0,
    block_start_timestamp: '1689604770.044',
    event_offset: '3.015',
    event_start_timestamp: '1689604773.059',
    event_type: 'Stimulus',
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: 1,
    trial_offset: '0.000',
    trial_start_timestamp: '1689604770.044',
    trial_type: '6.jpg',
    video_display_request_timestamp: '1689604773.059',
  },
  {
    block_number: 0,
    block_start_timestamp: '.',
    event_offset: '.',
    event_start_timestamp: '.',
    event_type: 'Response',
    experiment_start_timestamp: '.',
    response: 'R',
    response_accuracy: '0',
    response_time: '1.221',
    response_touch_timestamp: '1689604774.280',
    trial_number: 1,
    trial_offset: '0.000',
    trial_start_timestamp: '.',
    trial_type: '6.jpg',
    video_display_request_timestamp: '.',
  },
];

const test1FlankerResponses = [
  {
    block_number: 1,
    block_start_timestamp: '1689604842.697',
    event_offset: '0.000',
    event_start_timestamp: '1689604842.697',
    event_type: 'Fixation',
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: 1,
    trial_offset: '0.000',
    trial_start_timestamp: '1689604842.697',
    trial_type: '6.jpg',
    video_display_request_timestamp: '1689604842.697',
  },
  {
    block_number: 1,
    block_start_timestamp: '1689604842.697',
    event_offset: '0.000',
    event_start_timestamp: '1689604845.705',
    event_type: 'Stimulus',
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: 2,
    trial_offset: '3.008',
    trial_start_timestamp: '1689604845.705',
    trial_type: '6.jpg',
    video_display_request_timestamp: '1689604845.705',
  },
  {
    block_number: 1,
    block_start_timestamp: '.',
    event_offset: '.',
    event_start_timestamp: '.',
    event_type: 'Response',
    experiment_start_timestamp: '.',
    response: 'L',
    response_accuracy: '1',
    response_time: '1.515',
    response_touch_timestamp: '1689604847.220',
    trial_number: 2,
    trial_offset: '3.008',
    trial_start_timestamp: '.',
    trial_type: '6.jpg',
    video_display_request_timestamp: '.',
  },
  {
    duration: 3001.7999999970198,
    offset: 1689604842359.8,
    question:
      '<div class="mindlogger-fixation"><img src="https://media-dev.cmiml.net/mindlogger/391962851007982489/50635b4f-7457-4677-9d2d-99132189eba2/5.jpg" alt="5.jpg"></div>',
    response_touch_timestamp: 1689604845698.8,
    start_time: 337.20000000298023,
    start_timestamp: 1689604842697,
    tag: 'fixation',
    trial_index: 1,
  },
  {
    button_pressed: '0',
    correct: true,
    duration: 1514.8999999985099,
    offset: 1689604842359.5,
    question:
      '<img src="https://media-dev.cmiml.net/mindlogger/391962851007982489/62e876f7-3144-4774-aaf1-aaf1ed3001eb/6.jpg" alt="6.jpg">',
    response_touch_timestamp: 1689604847219.9,
    start_time: 3345.9000000059605,
    start_timestamp: 1689604845705,
    tag: 'trial',
    trial_index: 2,
  },
  {
    duration: 3001.2000000029802,
    offset: 1689604842360,
    question:
      '<div class="mindlogger-fixation"><img src="https://media-dev.cmiml.net/mindlogger/391962851007982489/50635b4f-7457-4677-9d2d-99132189eba2/5.jpg" alt="5.jpg"></div>',
    response_touch_timestamp: 1689604850230.2,
    start_time: 4869,
    start_timestamp: 1689604847229,
    tag: 'fixation',
    trial_index: 3,
  },
  {
    button_pressed: '0',
    correct: true,
    duration: 599.3000000044703,
    offset: 1689604842361,
    question:
      '<img src="https://media-dev.cmiml.net/mindlogger/391962851007982489/62e876f7-3144-4774-aaf1-aaf1ed3001eb/6.jpg" alt="6.jpg">',
    response_touch_timestamp: 1689604850839.3,
    start_time: 7880.5,
    start_timestamp: 1689604850240,
    tag: 'trial',
    trial_index: 4,
  },
  {
    duration: 3001.6999999955297,
    offset: 1689604842359.7,
    question:
      '<div class="mindlogger-fixation"><img src="https://media-dev.cmiml.net/mindlogger/391962851007982489/50635b4f-7457-4677-9d2d-99132189eba2/5.jpg" alt="5.jpg"></div>',
    response_touch_timestamp: 1689604853854.7,
    start_time: 8493.30000000447,
    start_timestamp: 1689604850853,
    tag: 'fixation',
    trial_index: 5,
  },
  {
    button_pressed: '1',
    correct: false,
    duration: 104,
    offset: 1689604842361.3,
    question:
      '<img src="https://media-dev.cmiml.net/mindlogger/391962851007982489/62e876f7-3144-4774-aaf1-aaf1ed3001eb/6.jpg" alt="6.jpg">',
    response_touch_timestamp: 1689604853968,
    start_time: 11504.40000000596,
    start_timestamp: 1689604853864,
    tag: 'trial',
    trial_index: 6,
  },
  {
    duration: 3000.89999999851,
    offset: 1689604842359.7,
    question:
      '<div class="mindlogger-fixation"><img src="https://media-dev.cmiml.net/mindlogger/391962851007982489/50635b4f-7457-4677-9d2d-99132189eba2/5.jpg" alt="5.jpg"></div>',
    response_touch_timestamp: 1689604856974.9,
    start_time: 11614.30000000447,
    start_timestamp: 1689604853974,
    tag: 'fixation',
    trial_index: 7,
  },
  {
    button_pressed: '0',
    correct: true,
    duration: 406.3999999985099,
    offset: 1689604842361.9,
    question:
      '<img src="https://media-dev.cmiml.net/mindlogger/391962851007982489/62e876f7-3144-4774-aaf1-aaf1ed3001eb/6.jpg" alt="6.jpg">',
    response_touch_timestamp: 1689604857393.4,
    start_time: 14626.80000000447,
    start_timestamp: 1689604856987,
    tag: 'trial',
    trial_index: 8,
  },
];
const test1Item = {
  question: '',
  responseType: 'flanker',
  responseValues: null,
  config: {
    stimulusTrials: [
      {
        id: '1c60f5cb-3668-49ef-b2be-c68643aa4ca1',
        image:
          'https://media-dev.cmiml.net/mindlogger/391962851007982489/62e876f7-3144-4774-aaf1-aaf1ed3001eb/6.jpg',
        text: '6.jpg',
        value: 0,
        weight: null,
      },
    ],
    blocks: [
      {
        name: 'Block 1',
        order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
      },
      {
        name: 'Block 2',
        order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
      },
      {
        name: 'Block 3',
        order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
      },
      {
        name: 'Block 4',
        order: ['1c60f5cb-3668-49ef-b2be-c68643aa4ca1'],
      },
    ],
    buttons: [
      {
        text: 'L_btn',
        image: '',
        value: 0,
      },
      {
        text: 'R_btn',
        image: '',
        value: 1,
      },
    ],
    nextButton: 'Continue',
    fixationDuration: 3000,
    fixationScreen: {
      value: '5.jpg',
      image:
        'https://media-dev.cmiml.net/mindlogger/391962851007982489/50635b4f-7457-4677-9d2d-99132189eba2/5.jpg',
    },
    minimumAccuracy: null,
    sampleSize: 1,
    samplingMethod: 'randomize-order',
    showFeedback: false,
    showFixation: true,
    showResults: true,
    trialDuration: 3000,
    isLastPractice: false,
    isFirstPractice: false,
    isLastTest: false,
    blockType: 'test',
  },
  name: 'Flanker_test_1',
  isHidden: false,
  conditionalLogic: null,
  allowEdit: false,
  id: '1644cce8-ee6b-469a-a400-45cb5a96f36c',
};
const test1Result = [
  {
    block_number: 1,
    block_start_timestamp: 'NaN',
    event_offset: 'NaN',
    event_start_timestamp: 'NaN',
    event_type: undefined,
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: undefined,
    trial_offset: 'NaN',
    trial_start_timestamp: 'NaN',
    trial_type: -1,
    video_display_request_timestamp: 'NaN',
  },
  {
    block_number: 1,
    block_start_timestamp: 'NaN',
    event_offset: 'NaN',
    event_start_timestamp: 'NaN',
    event_type: undefined,
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: undefined,
    trial_offset: 'NaN',
    trial_start_timestamp: 'NaN',
    trial_type: -1,
    video_display_request_timestamp: 'NaN',
  },
  {
    block_number: 1,
    block_start_timestamp: 'NaN',
    event_offset: 'NaN',
    event_start_timestamp: 'NaN',
    event_type: undefined,
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: undefined,
    trial_offset: 'NaN',
    trial_start_timestamp: 'NaN',
    trial_type: -1,
    video_display_request_timestamp: 'NaN',
  },
  {
    block_number: 1,
    block_start_timestamp: 'NaN',
    event_offset: '0.000',
    event_start_timestamp: '1689604842.697',
    event_type: 'Fixation',
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: 1,
    trial_offset: 'NaN',
    trial_start_timestamp: '1689604842.697',
    trial_type: '6.jpg',
    video_display_request_timestamp: '1689604842.697',
  },
  {
    block_number: 1,
    block_start_timestamp: 'NaN',
    event_offset: '0.000',
    event_start_timestamp: '1689604845.705',
    event_type: 'Stimulus',
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: 2,
    trial_offset: 'NaN',
    trial_start_timestamp: '1689604845.705',
    trial_type: '6.jpg',
    video_display_request_timestamp: '1689604845.705',
  },
  {
    block_number: 1,
    block_start_timestamp: '.',
    event_offset: '.',
    event_start_timestamp: '.',
    event_type: 'Response',
    experiment_start_timestamp: '.',
    response: 'L',
    response_accuracy: '1',
    response_time: '1.515',
    response_touch_timestamp: '1689604847.220',
    trial_number: 2,
    trial_offset: 'NaN',
    trial_start_timestamp: '.',
    trial_type: '6.jpg',
    video_display_request_timestamp: '.',
  },
  {
    block_number: 1,
    block_start_timestamp: 'NaN',
    event_offset: '0.000',
    event_start_timestamp: '1689604847.229',
    event_type: 'Fixation',
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: 3,
    trial_offset: 'NaN',
    trial_start_timestamp: '1689604847.229',
    trial_type: '6.jpg',
    video_display_request_timestamp: '1689604847.229',
  },
  {
    block_number: 1,
    block_start_timestamp: 'NaN',
    event_offset: '0.000',
    event_start_timestamp: '1689604850.240',
    event_type: 'Stimulus',
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: 4,
    trial_offset: 'NaN',
    trial_start_timestamp: '1689604850.240',
    trial_type: '6.jpg',
    video_display_request_timestamp: '1689604850.241',
  },
  {
    block_number: 1,
    block_start_timestamp: '.',
    event_offset: '.',
    event_start_timestamp: '.',
    event_type: 'Response',
    experiment_start_timestamp: '.',
    response: 'L',
    response_accuracy: '1',
    response_time: '0.599',
    response_touch_timestamp: '1689604850.839',
    trial_number: 4,
    trial_offset: 'NaN',
    trial_start_timestamp: '.',
    trial_type: '6.jpg',
    video_display_request_timestamp: '.',
  },
  {
    block_number: 1,
    block_start_timestamp: 'NaN',
    event_offset: '0.000',
    event_start_timestamp: '1689604850.853',
    event_type: 'Fixation',
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: 5,
    trial_offset: 'NaN',
    trial_start_timestamp: '1689604850.853',
    trial_type: '6.jpg',
    video_display_request_timestamp: '1689604850.853',
  },
  {
    block_number: 1,
    block_start_timestamp: 'NaN',
    event_offset: '0.000',
    event_start_timestamp: '1689604853.864',
    event_type: 'Stimulus',
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: 6,
    trial_offset: 'NaN',
    trial_start_timestamp: '1689604853.864',
    trial_type: '6.jpg',
    video_display_request_timestamp: '1689604853.866',
  },
  {
    block_number: 1,
    block_start_timestamp: '.',
    event_offset: '.',
    event_start_timestamp: '.',
    event_type: 'Response',
    experiment_start_timestamp: '.',
    response: 'R',
    response_accuracy: '0',
    response_time: '0.104',
    response_touch_timestamp: '1689604853.968',
    trial_number: 6,
    trial_offset: 'NaN',
    trial_start_timestamp: '.',
    trial_type: '6.jpg',
    video_display_request_timestamp: '.',
  },
  {
    block_number: 1,
    block_start_timestamp: 'NaN',
    event_offset: '0.000',
    event_start_timestamp: '1689604853.974',
    event_type: 'Fixation',
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: 7,
    trial_offset: 'NaN',
    trial_start_timestamp: '1689604853.974',
    trial_type: '6.jpg',
    video_display_request_timestamp: '1689604853.974',
  },
  {
    block_number: 1,
    block_start_timestamp: 'NaN',
    event_offset: '0.000',
    event_start_timestamp: '1689604856.987',
    event_type: 'Stimulus',
    experiment_start_timestamp: '1689604761.000',
    response: '.',
    response_accuracy: '.',
    response_time: '.',
    response_touch_timestamp: '.',
    trial_number: 8,
    trial_offset: 'NaN',
    trial_start_timestamp: '1689604856.987',
    trial_type: '6.jpg',
    video_display_request_timestamp: '1689604856.989',
  },
  {
    block_number: 1,
    block_start_timestamp: '.',
    event_offset: '.',
    event_start_timestamp: '.',
    event_type: 'Response',
    experiment_start_timestamp: '.',
    response: 'L',
    response_accuracy: '1',
    response_time: '0.406',
    response_touch_timestamp: '1689604857.393',
    trial_number: 8,
    trial_offset: 'NaN',
    trial_start_timestamp: '.',
    trial_type: '6.jpg',
    video_display_request_timestamp: '.',
  },
];

describe('getFlankerRecords', () => {
  test.each`
    responses                   | item            | experimentClock  | itemIndex | expected          | description
    ${practiceFlankerResponses} | ${practiceItem} | ${1689604761000} | ${2}      | ${practiceResult} | ${'should generate records for practice item'}
    ${test1FlankerResponses}    | ${test1Item}    | ${1689604761000} | ${8}      | ${test1Result}    | ${'should generate records for test1 item'}
  `('$description', ({ responses, item, experimentClock, itemIndex, expected }) => {
    expect(
      getFlankerRecords({
        responses,
        item,
        experimentClock,
        itemIndex,
      }),
    ).toEqual(expected);
  });
});
