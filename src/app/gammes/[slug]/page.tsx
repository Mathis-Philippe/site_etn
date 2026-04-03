import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  Wind, 
  Droplets, 
  Factory, 
  Waves, 
  Wrench,
  CheckCircle, 
  ArrowRight, 
  Cog, 
  LucideIcon 
} from 'lucide-react';
import DynamicHead from '../../../components/DynamicHead';

// Définition de la structure exacte d'une gamme
interface GammeData {
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  features: string[];
}

// Base de données locale reprenant l'architecture de votre ancien site
const gammesData: Record<string, GammeData> = {
  'pneumatique': {
    title: 'Gamme Pneumatique',
    subtitle: "Raccords, Coupleurs, Composants et Vannes Basse Pression",
    description: "ETN vous accompagne dans tous vos besoins en pneumatique industrielle. Nous stockons et distribuons une large gamme de composants pour la production, le traitement et la distribution de votre air comprimé.",
    icon: Wind,
    features: [
      "Raccords rapides, express, instantanés, joints à lèvre et raccords fonte",
      "Coupleurs Basse Pression (gamme standard et pour moules)",
      "Composants pneumatiques (Vérins, FRL, Distribution, Limiteurs de débit)",
      "Vannes Basse Pression (Robinet à boisseau sphérique 2 et 3 voies)"
    ]
  },
  'haute-pression': {
    title: 'Gamme Haute Pression',
    subtitle: "Flexibles, Embouts, Raccords et Tubes pour l'Hydraulique",
    description: "Des solutions complètes pour la transmission de puissance hydraulique : tuyaux, embouts, adaptateurs, composants et coupleurs pour tous vos engins de TP, agricoles ou industriels.",
    icon: Droplets,
    features: [
      "Flexibles Hydrauliques (R1T, R2T, R2C, R9R, 4SH, R13)",
      "Embouts Hydrauliques (à sertir type T et interlock)",
      "Raccords à bague (Série DIN et Millimétrique) et Tubes Hydrauliques",
      "Colliers de Fixation et Brides Hydrauliques (3000 à 6000 PSI)",
      "Coupleurs (Eaton, Faster, Iso A/B, Agricole, Anti-pollution)",
      "Vannes Haute Pression (2 voies, 3 voies, en T, en L)"
    ]
  },
  'industries': {
    title: 'Gamme Industries',
    subtitle: "Onduleux Inox, Tuyaux industriels et Connectiques Spécifiques",
    description: "La gamme la plus complète du marché destinée à l'industrie, au transfert de fluides (vapeur, hydrocarbures, produits chimiques, alimentaires) et à la maintenance.",
    icon: Factory,
    features: [
      "Onduleux Inox (du 1/4 au 4 pouces sur stock)",
      "Tuyaux industriels (multi-services, hydrocarbures, caoutchouc, alimentaires)",
      "Raccords à came (laiton, inox, bronze, alu, Type A à F)",
      "Raccords Storz (cannelé, taraudé femelle, fileté mâle)",
      "Raccords laiton (fileté mâle Gaz, femelle Gaz tournant)"
    ]
  },
  'lavage': {
    title: 'Gamme Lavage',
    subtitle: "Flexibles de lavage, Poignées, Lances et Accessoires",
    description: "Retrouvez ici tous les équipements haute pression dédiés au lavage professionnel et industriel, adaptés pour l'eau chaude, l'eau froide, la vapeur ou l'alimentaire.",
    icon: Waves,
    features: [
      "Flexibles Haute Pression (Eau chaude, froide, vapeur, alimentaire)",
      "Poignées (simples ou avec raccord tournant) et Lances (simples ou doubles)",
      "Raccords Haute Pression et raccords d'arrosage",
      "Buses de lavage (buse de curage inox, jet avant/arrière, rotabuse)",
      "Enrouleurs (Acier et Inox)"
    ]
  },
  'freinage-durite-aviation': {
    title: 'Gamme Freinage Durite Aviation',
    subtitle: "Solutions BrakeQuip pour automobiles, motos et engins",
    description: "Découvrez notre gamme déposée BrakeQuip, unique dans les Hauts-de-France. Des outils spécialisés et raccords pour automobiles, TP, remorques, tracteurs, voirie, motos et véhicules anciens.",
    icon: Wrench,
    features: [
      "Flexibles de frein (caoutchouc ou tressé inox pour tous véhicules)",
      "Flexibles de Direction assistée (haute et basse pression)",
      "Reproduction de tubes métalliques sur mesure au modèle",
      "Tubes EziBend en cuivre-nickel ou acier inox pour remplacer la rouille",
      "Raccords spéciaux et solutions BrakeQuip"
    ]
  }
};

export default async function GammePage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const gamme = gammesData[resolvedParams.slug];

  if (!gamme) {
    notFound();
  }

  const Icon = gamme.icon || Cog;

  return (
    <>
      <DynamicHead 
        title={`ETN - ${gamme.title}`}
        favicon="/images/favicon.png"
      />
      
      <main className="min-h-screen bg-gray-50">
        <section className="bg-blue-900 text-white py-20 relative overflow-hidden">
          <Icon className="absolute -right-10 -top-10 w-96 h-96 text-white/5 transform rotate-12" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 bg-yellow-400/20 text-yellow-400 px-4 py-2 rounded-full font-semibold mb-6">
                <Icon className="w-5 h-5" />
                <span>Notre Expertise</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                {gamme.title}
              </h1>
              <p className="text-xl text-white/90 font-medium">
                {gamme.subtitle}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-12">
              
              <div className="lg:w-1/2 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-blue-900 mb-6">À propos de cette gamme</h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {gamme.description}
                  </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center">
                    <Cog className="w-6 h-6 mr-3 text-yellow-500" />
                    Nos solutions comprennent :
                  </h3>
                  <ul className="space-y-4">
                    {gamme.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-lg">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:w-1/2 flex flex-col justify-center">
                <div className="bg-gradient-to-br from-blue-50 to-gray-100 p-10 rounded-3xl border border-blue-100 text-center shadow-inner">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                    <Icon className="w-12 h-12 text-blue-900" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-4">
                    Besoin de matériel de la {gamme.title.toLowerCase()} ?
                  </h3>
                  <p className="text-gray-600 mb-8 px-4">
                    Parcourez notre catalogue en ligne ou contactez nos experts pour obtenir un devis personnalisé adapté à vos besoins industriels.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                      href="/produits" 
                      className="inline-flex items-center justify-center bg-blue-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-800 transition-all group"
                    >
                      Voir les produits
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link 
                      href="/contact" 
                      className="inline-flex items-center justify-center bg-yellow-400 text-blue-900 px-8 py-4 rounded-xl font-bold hover:bg-yellow-500 transition-all shadow-md"
                    >
                      Nous contacter
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}