import AboutUsSection from "../components/AboutUsSection";
import NewsSection from "../components/NewsSection";
import MerchandisingSection from "../components/MerchandisingSection";
const Home = () => {
    return (
        <>
            <div>   
                <h1>Escuela Sabática FACEA</h1>
                <p>Te damos la bienvenida al sitio de la Escuela Sabática de la Facultad de Ciencias Económicas y Administrativas (FACEA). Aquí encontrarás recursos, información y actividades relacionadas con la Escuela Sabática para estudiantes, profesores y miembros de la comunidad académica. Nuestro objetivo es fomentar el aprendizaje, la reflexión y el crecimiento espiritual a través de la Escuela Sabática. ¡Únete a nosotros en este viaje de conocimiento y fe!</p>
            </div>
            
            <AboutUsSection />
            <NewsSection />
            <MerchandisingSection />
        </>
    );
};

export default Home;