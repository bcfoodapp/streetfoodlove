import { Container, Header } from "semantic-ui-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

export default function AddArticle5() {
  const divToPrint = useRef<HTMLElement>(null);

  function printDocument() {
    let targetDiv = divToPrint.current!;
    html2canvas(targetDiv).then(function (canvas) {
      document.body.appendChild(canvas);
      var imgData = canvas.toDataURL("image/png");
      var imgWidth = 210;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      var doc = new jsPDF("p", "mm");
      var position = 5;

      doc.addImage(imgData, "PNG", 0.4, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 0.4, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      doc.save("How-To-Start-Food-Cart-Business.pdf");
    });
  }

  return (
    <Container>
      <Header as="h2">
        10 Tips for Running a Successful Food Truck Business
      </Header>
      <p>
        Food trucks are more popular today than ever before; you've likely seen
        them at festivals, birthday parties, weddings, and other special events.
        In addition, since the COVID-19 pandemic began, many patrons have opted
        for grabbing meals from food trucks instead of visiting restaurants.If
        you're intrigued by running a food truck or already own one and want to
        learn how to grow a food truck business, keep reading this post!
      </p>
      <h3>The Food Truck Craze Continues</h3>
      <p>
        The idea of food trucks began in 1961 when street vendors sold food from
        carts in New York. Construction workers, delivery personnel, and garment
        workers bought meat, sandwiches, and fruit. In 1974, King Taco's first
        taco truck came to life and led to a successful brick-and-mortar
        restaurant chain in Southern California.Since then, the industry has
        evolved to feature brightly colored exteriors, often with unique
        branding. Many of these business owners focus on specific types of food,
        such as pizza, tacos, grilled cheese, and cupcakes. For example, The
        French Quarter is a truck in New Jersey that offers Cajun-style
        jambalaya, fried shrimp, and other New Orleans fare. Food trucks have
        been growing exponentially since the recession in 2008.
      </p>
      <p>
        As of 2019, there were more than 23,000 food trucks in the United
        States, earning about $1 billion each year.When they first started to
        appear on the food scene in 2008, food trucks were considered "trendy".
        Today, however, they're a mainstream concept often preferred over
        restaurants and fast food.
      </p>
      <h4>Inside The Growth of the Food Truck Industry</h4>
      <p>
        While the restaurant industry has grown about 2 percent in recent years,
        food trucks have skyrocketed at an annual growth rate of 7.9 percent.
        The food truck craze shows no sign of slowing down as people view food
        trucks as a fun and affordable way to try new foods.More and more people
        are realizing the growth of this industry and pursuing food truck
        ventures as a result. Here's why: they require a much smaller initial
        investment than a restaurant. Startup costs will depend on your state
        but are typically as little as $30,000 to $40,000.
      </p>
      <p>
        Although there are food trucks in most cities, they are prevalent in
        places like Austin, Los Angeles, Portland, and Seattle. They are often
        successful business ventures patrons can visit in busy streets, business
        districts, farmer's markets, bars, sports venues, gas stations, and
        anywhere they're legally allowed to be.
      </p>

      <h3>10 Tips for Food Truck Success</h3>
      <p>
        Although it's easier and more affordable to start a food truck instead
        of a brick-and-mortar location, it does take time and effort to ensure
        success. Specific strategies can help you stand out from other food
        trucks, gain new customers, retain loyal ones, and maximize your
        profits.
      </p>
      <p>
        Let's dive deeper into some of the best tips for starting and growing a
        successful business in this industry.
      </p>
      <h4>1. Perform Extensive Market Research </h4>
      <p>
        Before you buy a food truck, take time to conduct thorough market
        research. Your research should help you uncover the answers to questions
        such as:
      </p>
      <ul>
        <li>Is there an emerging food trend in your town or city?</li>
        <li>Do certain areas need food trucks?</li>
        <li>Is there an abundance of a certain type of food truck?</li>
      </ul>
      <p>
        If you know the answers to these questions, you'll find it easier to
        make strategic business decisions.
      </p>
      <h4>2.Choose Your Truck Cuisine Wisely</h4>
      <p>
        The options are endless when selecting the kind of food truck business
        you want to open. You can offer cuisine such as:
      </p>
      <ul>
        <li>Pizza</li>
        <li>Barbeque</li>
        <li>Sliders</li>
        <li>Tacos</li>
        <li>Grilled cheese</li>
        <li>Dessert</li>
      </ul>
      <p>
        To select the perfect food truck cuisine, you'll need to conduct market
        research. If you discover numerous grilled cheese food trucks in your
        area, but there aren't any pizza trucks, that may inform your
        decision.Try to choose a food truck that allows for less competition, is
        also affordable, and suits your interests.
      </p>
      <h4>3. Make A List of Necessary Supplies</h4>
      <p>
        You'll need various supplies to open and operate your mobile food
        business in the long term. Your list will likely include items such as:
      </p>
      <ul>
        <li>Disposable gloves</li>
        <li>Aluminum foil</li>
        <li>Containers</li>
        <li>Dishes</li>
        <li>Utensils</li>
        <li>Cleaning supplies</li>
        <li>Safety supplies.</li>
      </ul>
      <p>
        Once you create a list, you can shop around to find the best deals on
        supplies and inventory. Most likely, this simple strategy can save you a
        great deal of time and money.
      </p>
      <h4>4. Buy the Right Truck</h4>
      <p>
        Not all food trucks are created equal; believe it or not, food trucks
        range in price from $50,000 to $250,000. In addition, you can buy a new
        or used truck or even consider leasing a truck. Typically, new trucks
        are customizable but can be very expensive.On the other hand, used
        trucks are cheaper than new ones but come with a higher risk of
        expensive maintenance. Another option is to lease a truck to test your
        venture and spend less cash each month.When you figure out what type of
        food truck you want to buy or lease, go to a reputable truck dealer like
        Prestige Food Trucks, Cruising Kitchens, or FoodTrucks.net.
      </p>
      <p>
        Lastly, you'll need to consider how to finance your food truck purchase.
        Many business owners pursue food truck business loans to purchase their
        vehicles in this situation. Once you receive a food truck loan, you'll
        have the funds to buy your truck without taking away cash flow from
        other business expenses.
      </p>
      <h4>5. Incorporate To Protect Your Assets</h4>
      <p>
        You could start your food truck business as a sole proprietorship and
        incorporate it down the road. However, the wise move is to incorporate
        your business from the start. Since you'll be selling food products,
        which can make people sick, incorporating can protect your assets in the
        event of a lawsuit. First, decide on a name and register your business
        in your state. Then, obtain an Employer Identification Number from the
        IRS. Ensuring that you have all required licenses and permits will be
        crucial.
      </p>
      <h4>6. Set A Budget and Pursue Financing</h4>
      <p>
        A solid budget is a vital part of any food truck business plan. To
        create financial projections, you should write down the amount of money
        you want to spend for each business component. These components may
        include kitchen equipment, hiring truck operators, vehicle maintenance,
        and marketing.
      </p>
      <p>
        Remember that the food truck market and regulations will likely cause
        budget changes over time. Also, make sure your budget is realistic and
        allows you to take on as little debt as possible.As previously
        mentioned, food truck loans can be a great way to finance your business.
        So, after your budget is complete, research business financing options
        such as:
      </p>
      <ul>
        <li>Small Business Loans</li>
        <li>Equipment Financing-Equipment Loans or Leases</li>
        <li>Business Line of Credit</li>
        <li>Business Credit Cards</li>
        <li>SBA Loans</li>
      </ul>
      <h4>7. Try Creative Marketing Tactics</h4>
      <p>
        Marketing is one of the keys to business success, so you should create a
        marketing strategy that involves multiple approaches. Here are a few top
        examples:
      </p>
      <ul>
        <li>
          Try digital marketing strategies such as Facebook ads and Search
          Engine Optimization-SEO.
        </li>
        <li>
          Create an email newsletter, informing nearby patrons of where your
          truck is parked and what your menu includes
        </li>
        <li>Invest in traditional initiatives like direct mail marketing.</li>
      </ul>
      <h4>8. Park Your Truck at High Volume Locations</h4>
      <p>
        As a food truck owner, you have the freedom to take your business just
        about anywhere. Think about where your ideal customers hang out the
        most, then get clearance to park your truck there and see if the
        location attracts significant foot traffic. Food trucks perform
        optimally at festivals, business districts, and food truck parks.
        However, since the COVID-19 pandemic, food trucks have also become
        popular in residential areas, as patrons like getting food and eating it
        safely in their homes.
      </p>
      <h4>9. Monitor Online Reviews</h4>
      <p>
        In the present day, reviews can make or break your small business. For
        this reason, it's in your best interest to monitor your reviews
        regularly.If possible, respond to all customer reviews, regardless of if
        they are good or bad. This way, prospective customers who search for
        your business online will know that you value your customers and are
        always looking to improve.To increase reviews, you may want to offer an
        incentive, such as a discount, so that customers review your food truck,
        and you build trust online.
      </p>
      <h4>10. Leverage social media</h4>
      <p>
        Social media marketing can do wonders for your food truck business.
        Create compelling Facebook, Twitter, and Instagram pages and update them
        often. Share information such as:
      </p>
      <p>Your hottest menu items</p>
      <ul>
        <li>Where your truck will be parked</li>
        <li>Deals</li>
        <li>Giveaways</li>
        <li>
          Get people excited about your business so they become followers; this
          could prompt them to share your content with their network.
        </li>
      </ul>
      <p>
        A food truck business can be an exciting way to become an entrepreneur,
        earn a living, and make a positive difference in your community.
        However, just like any business, it takes hard work, dedication, and
        patience. As long as you select the right financing option and follow
        these tips, your chances of success are very high.
      </p>
    </Container>
  );
}
