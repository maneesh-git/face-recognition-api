
const handleSignin = (req,res,db,bcrypt) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).json("Incorrect Form parameters");
    }
    db.select('email','hash').from('login')
    .where('email','=',email)
    .then(userData => {
        const isValid = bcrypt.compareSync(password,userData[0].hash);
        if(isValid){
            return db.select('*').from('users')
                    .where('email','=',email)
                    .then(user => res.json(user[0]))
                    .catch(err => res.status(400).json("Unable to find user"))
        }
        else{
            res.status(400).json("Wrong credentials");
        }
    })
    .catch(err => res.status(400).json("Wrong credentials"))
}

module.exports = {
    handleSignin
}