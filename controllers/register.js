const handleRegister = (req,res,db,bcrypt) => {
    
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        return res.status(400).json("Incorrect Form parameters");
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    db.transaction(trx => {
        trx.insert({ email : email, hash : hash})
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                        .returning('*')
                        .insert({
                            email : email,
                            name : name,
                            joined : new Date()
                        })
                        .then(user => res.json(user[0]))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
    .catch(err => res.status(400).json("Unable to register"));
}

module.exports = {
    handleRegister
};