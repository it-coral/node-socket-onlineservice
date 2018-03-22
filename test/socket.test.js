'use strict'

const expect = require('chai').expect
  , server = require('../app')
  , io = require('socket.io-client')
  , ioOptions = { 
      transports: ['websocket']
    , forceNew: true
    , reconnection: false
  }
  , testMsg = 'HelloWorld'

let sender, receiver
const vvapi = require('../src/vvapi.service')
const EVENT = require('../src/Constants/events')
const chai = require('chai')  
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
const should = chai.should()


describe('Chat Events', function(){
  beforeEach(function(done){
    
    sender = io('http://localhost:3000/', ioOptions)
    receiver = io('http://localhost:3000/', ioOptions)
    
    done()
  })
  afterEach(function(done){
    sender.disconnect()
    receiver.disconnect()
    done()
  })

  after(function(done){
    server.close()
    done()
  })

  describe('Hello Event', function(){
    it('Clients should fail hello without token', function(done){
      sender.emit(EVENT.USER_HELLO_EVENT, {userId:'sss'})

      sender.on(EVENT.USER_HELLOFAIL_EVENT, function(data){
        expect(data.message).to.equal('PARMAS NOT FILLED OR ALREADY SAID HELLO')  
        done()
      })
    })
  });


  describe('Hello Event', function(){

    it('should fail with wrong password', function(done){

      vvapi.getToken({username: process.env.TESTUSERNAME, password: 'test'})
      .then(data=>{
        should.not.exist(data.access_token)
        done();
      }).catch(err=>{
        should.exist(err)
        done();
      })
    })

    it('should sucess hello', function(done){

      vvapi.getToken({username: process.env.TESTUSERNAME, password: process.env.TESTUSERPASSWORD})
      .then(data=>{
        should.exist(data.access_token)

        sender.emit(EVENT.USER_HELLO_EVENT, {userId: 3, userToken: data.access_token})

        sender.on(EVENT.USER_HELLOSUCCESS_EVENT, function(data){

          should.exist(data.user)
          should.exist(data.user.firstName)
          done()
        })

        sender.on(EVENT.USER_HELLOFAIL_EVENT, function(data){
          console.log(data);
          done()
        })
      }).catch(err=>{
        should.not.exist(err)
        done(err);
      })
    })
  })


  describe('Online user list Event', function(){

    it('should get user list from onlineusers', function(done){

      vvapi.getToken({username: process.env.TESTUSERNAME, password: process.env.TESTUSERPASSWORD})
      .then(data=>{
        should.exist(data.access_token)

        sender.emit(EVENT.USER_HELLO_EVENT, {userId: 3, userToken: data.access_token})

        sender.on(EVENT.USER_HELLOSUCCESS_EVENT, function(data){
          should.exist(data.user)
          should.exist(data.user.firstName)
          
          sender.emit(EVENT.GET_ONLINE_USERS)
          sender.on(EVENT.GET_ONLINE_USERS, function(data){
            should.exist(data[0])
            should.exist(data[0].user)
            should.exist(data[0].user.firstName)
            done()
          })
        })

      }).catch(err=>{
        should.not.exist(err)
        done(err);
      })
    })
  })


  describe('goodbye event', function(){

    it('goodbye should success', function(done){

      vvapi.getToken({username: process.env.TESTUSERNAME, password: process.env.TESTUSERPASSWORD})
      .then(data=>{
        should.exist(data.access_token)

        sender.emit(EVENT.USER_HELLO_EVENT, {userId: 3, userToken: data.access_token})

        sender.on(EVENT.USER_HELLOSUCCESS_EVENT, function(data){
          
          sender.emit(EVENT.USER_GOODBYE_EVENT)
          done()
        })

      }).catch(err=>{
        should.not.exist(err)
        done(err);
      })
    })
  })
})