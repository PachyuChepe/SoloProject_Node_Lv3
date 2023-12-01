const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const should = chai.should();

chai.use(chaiHttp);

describe("/POST signup", () => {
  it("it should POST a user", (done) => {
    let user = {
      email: "test@example.com",
      password: "Password123!",
      confirmPassword: "Password123!",
      name: "Test User",
    };
    chai
      .request(server)
      .post("/signup")
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.body.should.be.a("object");
        res.body.should.have.property("success").eql(true);
        done();
      });
  });
});
