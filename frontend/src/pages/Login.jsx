import Form from "../components/Form";


function Login() {
    // return form-component passing method of form and route to go to after submission
    return <Form route="/api/token/" method="login"/>
}

export default Login;