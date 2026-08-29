import { Stack } from "react-bootstrap"

const Introduction = () => {
    return (
        <Stack id="about" direction="horizontal" className="justify-content-center align-items-center px-3 relative py-5" style={{ backgroundColor: "#8FD8FD", color: "#000000", minHeight: "calc(100vh)", position: "relative" }}>
            <Svg1 style={{ position: "absolute", zIndex: 3, right: "10%", top: "15%" }} />
            <h4 className="mx-auto text-center" style={{ fontSize: "32px", fontWeight: "400", fontStyle: "italic", zIndex: 4, width: "80%" }}>
                Con Mate+ aprendes matemática útil, en minutos y sin vergüenza
                <br />
                <br />
                A través de una experiencia interactiva y adaptada a tus necesidades, te ayudamos a ganar confianza en los números y recuperar la autonomía financiera.

            </h4>
            <Svg2 style={{ position: "absolute", zIndex: 3, left: "10%", bottom: "20%" }} />
        </Stack>
    )
}

const Svg1 = ({ style }) => {
    return (
        <svg style={style} width="201" height="201" viewBox="0 0 201 201" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M156.201 156.425C163.772 148.854 166.333 138.17 163.883 128.493C173.567 130.954 184.263 128.395 191.841 120.818C203.281 109.377 203.281 90.8286 191.841 79.3881C184.308 71.8552 173.693 69.2823 164.055 71.6695C166.204 62.1847 163.586 51.8379 156.201 44.4529C148.613 36.865 137.898 34.3098 128.205 36.7873C130.773 27.0384 128.236 16.2232 120.593 8.58034C109.153 -2.86011 90.6044 -2.86011 79.1639 8.58034C71.5665 16.1778 69.0144 26.91 71.5076 36.6134C62.0059 34.4387 51.6301 37.0519 44.229 44.4529C36.8435 51.8385 34.2258 62.1864 36.3759 71.6719C26.7352 69.2806 16.1158 71.8526 8.58034 79.3881C-2.86011 90.8286 -2.86011 109.377 8.58034 120.818C16.1606 128.398 26.8613 130.956 36.5474 128.491C34.097 138.168 36.6575 148.853 44.229 156.425C51.5989 163.795 61.9187 166.417 71.3877 164.291C69.1005 173.866 71.6925 184.369 79.1639 191.841C90.6044 203.281 109.153 203.281 120.593 191.841C128.109 184.325 130.687 173.742 128.329 164.122C137.99 166.546 148.646 163.98 156.201 156.425Z" fill="#FFDB54" />
        </svg>
    )
}

const Svg2 = ({ style }) => {
    return (
        <svg style={style} width="188" height="188" viewBox="0 0 188 188" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M43.0221 144.873C86.6163 188.467 144.756 201.007 172.882 172.882C201.007 144.756 188.467 86.6162 144.873 43.0221C101.279 -0.572032 43.1385 -13.112 15.0132 15.0132C-13.112 43.1385 -0.571996 101.279 43.0221 144.873Z" fill="#FFDB54" />
        </svg>
    )
}

export default Introduction;