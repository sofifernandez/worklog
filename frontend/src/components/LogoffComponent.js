const LogoffComponent = () => {
    window.localStorage.removeItem('appJornalesToken')
    window.location.assign("/")
}
export default LogoffComponent