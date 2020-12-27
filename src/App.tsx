import React from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';

const App: React.FC = () => {
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
          <Form>
            <Form.Group>
              <Form.Label>
                センサーサイズ
              </Form.Label>
              <Form.Control as="select">
                <option value="full">フルサイズ</option>
                <option value="apsc-c">APS-C (Canon)</option>
                <option value="apsc-x">APS-C (それ以外)</option>
                <option value="mft">マイクロフォーサーズ</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>
                画像の横幅のピクセル数
              </Form.Label>
              <Form.Control type="range" min={1} max={10000} />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                実焦点距離
              </Form.Label>
              <Form.Control type="range" min={1} max={1000} />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                絞り値
              </Form.Label>
              <Form.Control type="range" min={1} max={36} />
            </Form.Group>
            <Form.Group>
              <Form.Label>
                星の写り方
              </Form.Label>
              <Form.Control as="select">
                <option value="pin-point">一つの点</option>
                <option value="slight">Slight Trail</option>
                <option value="visible">Visible Trail</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
