
import SectionTitle from '../../../ui/LandingPage/SectionTitle/SectionTitle';
import CategoryCard from '../../../ui/LandingPage/CategoryCard/CategoryCard';
import party from '../../../../assets/hero.jpg'
import game from '../../../../assets/game.jpg'
import nightlife from '../../../../assets/nightlife.jpg'
import tech from '../../../../assets/tech.jpg'
import Button from '../../../ui/LandingPage/Button/Button';

const ExploreCategories = () => {
  const categories = [
    { id: 1, title: 'TRAVEL EVENT', image:party },
    { id: 2, title: 'EDUCATION EVENT', image:tech },
    { id: 3, title: 'NIGHT LIFE', image:nightlife },
    { id: 4, title: 'TECHNOLOGY', image:tech},
    { id: 5, title: 'BUSINESS', image: game },
    { id: 6, title: 'SPORTS', image:game },
  ];

  return (
    <section className="py-5 bg-gradient-to-b">
      <div className="container mx-auto px-4">
        <SectionTitle 
         section={{
          title:"Explore Categories",
          description:"Find events that match your interests"
         }}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {categories.map(category => (
            <CategoryCard key={category.id} title={category.title} image={category.image} />
          ))}
        </div>
      </div>
      <br /><br />
      <div className="flex justify-center">
     
      <Button variant="outline">ALL CATEGORIES</Button>
      </div>
    </section>
  );
};

export default ExploreCategories;