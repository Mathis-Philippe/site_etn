import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#00183A] text-white py-6 border-t-4 border-t-[#FAB001]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:justify-around gap-8">
          
          
          <div>
            <p className="py-2 font-bold">ETN</p>
            <ul className="list-none space-y-1">
              <li>
                <Link href="/">Accueil</Link>
              </li>
              <li>
                <Link href="/products">Produits</Link>
              </li>
              <li>
                <Link href="/about">À Propos</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="#">Mentions Légales</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="py-2 font-bold">NOS SERVICES</p>
            <ul className="list-none space-y-1">
              <li>
                <Link href="/services/comptoir">Comptoir, Magasin, Expédition</Link>
              </li>
              <li>
                <Link href="/services/reparation">Atelier réparation</Link>
              </li>
              <li>
                <Link href="/services/flexpress">Service Flexpress</Link>
              </li>
              <li>
                <Link href="/services/graissage">Service Graissage</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="py-2 font-bold">NOS PRODUITS</p>
            <ul className="list-none space-y-1">
              <li>
                <Link href="/gammes/pneumatique">Gamme Pneumatique</Link>
              </li>
              <li>
                <Link href="/gammes/haute-pression">Gamme Haute pression</Link>
              </li>
              <li>
                <Link href="/gammes/industries">Gamme Industrie</Link>
              </li>
              <li>
                <Link href="/gammes/lavage">Gamme Lavage</Link>
              </li>
              <li>
                <Link href="/gammes/freinage-durite-aviation">Gamme Freinage, Durite, Aviation</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="py-2 font-bold">ACCÈS | CONTACT</p>
            <ul className="list-none space-y-1">
              <li>
                <p>1 chemin de Messines II</p>
              </li>
              <li>
                <p>59872 SAINT-ANDRÉ</p>
              </li>
              <li>
                <p>03 20 92 27 51</p>
              </li>
              <li>
                <p>Du lundi au vendredi</p>
              </li>
              <li>
                <p>De 8h à 18h (vendredi 17h)</p>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
