import React, { createContext, useContext, useEffect, useState } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';

type SensorSize = 'full' | 'apsc-c' | 'apsc-x' | 'mft';
type TrailType = 'pin-point' | 'slight' | 'visible';
type ActionType = 'setSensorSize' | 'setPixelWidth' | 'setFocalLength' | 'setFNumber' | 'setTrailType';

interface Action {
  type: ActionType;
  message?: string;
}

interface AppStore {
  sensorSize: SensorSize;
  pixelWidth: string;
  focalLength: string;
  fNumber: string;
  trailType: TrailType;
  time: number;
  dispatch: (action: Action) => void;
}

// センサーの種類ごとの、センサーの物理的な横幅(um)
const SENSOR_WIDTH: { [key: string]: number } = {
  'full': 36000,
  'apsc-c': 22300,
  'apsc-x': 23600,
  'mft': 17300
};

// 星の写り方ごとの係数
const TRAIL_PARAM: { [key: string]: number } = {
  'pin-point': 1.0,
  'slight': 2.0,
  'visible': 3.0
};

const useAppStore = (): AppStore => {
  const [sensorSize, setSensorSize] = useState<SensorSize>('full');
  const [pixelWidth, setPixelWidth] = useState(6000);
  const [focalLength, setFocalLength] = useState(50);
  const [fNumber, setFNumber] = useState(1.4);
  const [pixelWidthS, setPixelWidthS] = useState('6000');
  const [focalLengthS, setFocalLengthS] = useState('50');
  const [fNumberS, setFNumberS] = useState('1.4');
  const [trailType, setTrailType] = useState<TrailType>('pin-point');
  const [time, setTime] = useState(0.0);

  useEffect(() => {
    /* NPFルールによると、適切な露光時間は次の式で与えられる。
     * t=k*(16.856*N+0.0997*f+13.713*p)/(f*cos(δ))
     * Nは絞り値[F]、fは実焦点距離[mm]、pはピクセルピッチ[um]、δは天の赤道から緯度がどれだけ異なるか[rad]
     */
    const pixelPitch = SENSOR_WIDTH[sensorSize as string] / pixelWidth;
    const delta = 0.0;
    const k = TRAIL_PARAM[trailType as string];
    const time = k * (16.856 * fNumber + 0.0997 * focalLength + 13.713 * pixelPitch) / (focalLength * Math.cos(delta));
    setTime(time);
  }, [sensorSize, pixelWidth, focalLength, fNumber, trailType]);

  useEffect(() => {
    const pixel = parseInt(pixelWidthS, 10);
    if (!isNaN(pixel)) {
      setPixelWidth(pixel);
    }
  }, [pixelWidthS]);

  useEffect(() => {
    const focal = parseInt(focalLengthS, 10);
    if (!isNaN(focal)) {
      setFocalLength(focal);
    }
  }, [focalLengthS]);

  useEffect(() => {
    const f = Math.round(parseFloat(fNumberS) * 10.0) / 10.0;
    if (!isNaN(f)) {
      setFNumber(f);
    }
  }, [fNumberS]);

  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'setSensorSize':
        setSensorSize(action.message as SensorSize);
        break;
      case 'setPixelWidth':
        setPixelWidthS(action.message as string);
        break;
      case 'setFocalLength':
        setFocalLengthS(action.message as string);
        break;
      case 'setFNumber':
        setFNumberS(action.message as string);
        break;
      case 'setTrailType':
        setTrailType(action.message as TrailType);
        break;
    }
  };

  return {
    sensorSize,
    pixelWidth: pixelWidthS,
    focalLength: focalLengthS,
    fNumber: fNumberS,
    trailType,
    time,
    dispatch
  };
};

const AppContext = createContext<AppStore>({} as AppStore);

const InputForm: React.FC = () => {
  const { sensorSize, pixelWidth, focalLength, fNumber, trailType, time, dispatch } = useContext(AppContext);

  return <Form className="border p-3">
    <Form.Group>
      <Form.Label>
        センサーサイズ
    </Form.Label>
      <Form.Control as="select" value={sensorSize}
        onChange={(e) => dispatch({ type: 'setSensorSize', message: e.currentTarget.value })}>
        <option value="full">フルサイズ</option>
        <option value="apsc-c">APS-C (Canon)</option>
        <option value="apsc-x">APS-C (それ以外)</option>
        <option value="mft">マイクロフォーサーズ</option>
      </Form.Control>
    </Form.Group>
    <Form.Group>
      <div className="d-flex">
        <Form.Label>画像の横幅：</Form.Label>
        <Form.Control className="mx-1" style={{ width: 50 }} size="sm" value={pixelWidth} onChange={(e) => dispatch({ type: 'setPixelWidth', message: e.currentTarget.value })} />
        <Form.Label>[ピクセル]</Form.Label>
      </div>
      <Form.Control type="range" min={1} max={10000} value={pixelWidth}
        onChange={(e) => dispatch({ type: 'setPixelWidth', message: e.currentTarget.value })} />
    </Form.Group>
    <Form.Group>
      <div className="d-flex">
        <Form.Label>実焦点距離：</Form.Label>
        <Form.Control className="mx-1" style={{ width: 50 }} size="sm" value={focalLength} onChange={(e) => dispatch({ type: 'setFocalLength', message: e.currentTarget.value })} />
        <Form.Label>[mm]</Form.Label>
      </div>
      <Form.Control type="range" min={1} max={1000} value={focalLength}
        onChange={(e) => dispatch({ type: 'setFocalLength', message: e.currentTarget.value })} />
    </Form.Group>
    <Form.Group>
      <div className="d-flex">
        <Form.Label>絞り値：F</Form.Label>
        <Form.Control className="mx-1" style={{ width: 50 }} size="sm" value={fNumber} onChange={(e) => dispatch({ type: 'setFNumber', message: e.currentTarget.value })} />
      </div>
      <Form.Control type="range" min={0.7} max={36} value={fNumber} step={0.1}
        onChange={(e) => dispatch({ type: 'setFNumber', message: e.currentTarget.value })} />
    </Form.Group>
    <Form.Group>
      <Form.Label>
        星の写り方
    </Form.Label>
      <Form.Control as="select" value={trailType}
        onChange={(e) => dispatch({ type: 'setTrailType', message: e.currentTarget.value })}>
        <option value="pin-point">一つの点</option>
        <option value="slight">少し光跡が見える</option>
        <option value="visible">光跡が見える</option>
      </Form.Control>
    </Form.Group>
    <hr />
    <Form.Group>
      <Form.Label>適切な露光時間：{Math.round(time * 10.0) / 10.0}[秒]</Form.Label>
    </Form.Group>
  </Form>;
};

const App: React.FC = () => {
  const store = useAppStore();

  return (
    <Container>
      <Row className="my-3">
        <Col className="text-center">
          <h1>NPFルール</h1>
        </Col>
      </Row>
      <Row className="my-3">
        <Col className="text-center">
          <span>理論の詳細：<a href="https://sahavre.fr/wp/les-coulisses-de-la-regle-npf/">Les coulisses de la règle NPF</a></span>
        </Col>
      </Row>
      <Row className="my-3">
        <Col>
          <AppContext.Provider value={store}>
            <InputForm />
          </AppContext.Provider>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
