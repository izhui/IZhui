## IZhui
### How to use

    npm install izhui

### Example

    var iZ = require("iz");

    iZ.start(__dirname+"\\logic");

    var UserClass = iZ.model("user");

    var User = new UserClass(conn);

    User.create({ uname: 'Hello', upass: 'hello'},function( err, u ){
        if(err){
          console.log(err.message);
          console.log(err.stack);
        }
        console.log(u.toJSON());
    })

### U can see the [example]("./example")
