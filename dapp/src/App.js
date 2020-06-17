import React, { useState } from "react";
import { Button, Card, Container, Col, Dropdown, Form } from "react-bootstrap";
import "./App.css";
import Contract from "./contract";

Contract.initialize();

function App() {
  const [tokenId, setTokenId] = useState("");
  const [wallet, setwallet] = useState("");
  const [contractInitialized, setContractInitialized] = useState(
    Contract.initialized
  );

  window.addEventListener("contractInitialized", () => {
    setContractInitialized(true);
  });

  const getAddresses = () =>
    contractInitialized &&
    Contract.accounts.map(acc => (
      <Dropdown.Item key={acc} onClick={() => setwallet(acc)}>
        {acc}
      </Dropdown.Item>
    ));

  const submit = e => {
    e.preventDefault();
    console.log("Token: ", tokenId);
    console.log("Wallet: ", wallet);
    Contract.mint(tokenId, wallet);
  };

  return (
    <Container>
      <Card className="App-header">
        <h1>Mint Tokens</h1>
        <Form>
          <Form.Group controlId="formToken">
            <Form.Label>TokenId</Form.Label>
            <Form.Control
              placeholder="tokenId"
              value={tokenId}
              onChange={e => setTokenId(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formWallet">
            <Form.Label>Wallet</Form.Label>
            <Form.Row>
              <Col sm={9}>
                <Form.Control
                  placeholder="Wallet"
                  value={wallet}
                  onChange={e => setwallet(e.target.value)}
                />
              </Col>
              <Col sm={3}>
                <Dropdown>
                  <Dropdown.Toggle id="dropdown-wallet-basic">
                    Addresses
                  </Dropdown.Toggle>
                  <Dropdown.Menu>{getAddresses()}</Dropdown.Menu>
                </Dropdown>
              </Col>
            </Form.Row>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={submit}>
            Mint
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default App;
