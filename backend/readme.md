<!-- res.status(200).send(user).select("firstname lastname ");

    res.status(200).send(user) sends the user object as a response. After this, nothing further is executed because send() terminates the response.
    .select("firstname lastname") is called on the result of send(user), which is not a valid Mongoose query or object. This will throw an error because .select() isn't a method on plain JavaScript objects or the send() function. -->