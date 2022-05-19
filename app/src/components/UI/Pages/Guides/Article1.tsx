import { Button, Container, Header } from "semantic-ui-react";
import { ImageOptions, jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function AddArticle1() {
  function printDocument() {
    html2canvas(document.getElementById("divToPrint")!).then(function (canvas) {
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
      doc.save("file.pdf");
    });
  }

  return (
    <Container>
      <Container>
        <Button onClick={() => printDocument()}>Download as PDF</Button>
      </Container>
      <Container id="divToPrint">
        <Header as="h2"> How to start a food cart business?</Header>
        <p>
          The timing could not be better: it seems that the street food craze is
          sweeping the world. From bustling cities to small towns, food on
          wheels is a growing trend. And it is not just drawing street food
          fans, it is bringing in big bucks too: according to Intuit, the
          street-food business, including food trucks and mobile food carts, is
          a $2.7 billion industry that has seen a 12.4% growth in the last 5
          years alone!
        </p>
        <p>
          Traders are encouraged by the growing number of urban street markets,
          private events and street food festivals, while the entire trend is
          supported by the global rise of the foodie culture, making the public
          increasingly open to new taste experiences and quality cuisine.
        </p>
        <h3>The most popular street foods?</h3>
        <p>
          There are the classics:
          <em>hot dogs, hamburgers, ice cream and doughnuts.</em>
        </p>
        <p>
          Then there are those inspired by ethnic cuisines such as tacos,
          empanadas, sushi and crepes. The possibilities are endless and it is
          up to you, the entrepreneur, to find the dishes and recipes that will
          set you apart from the rest and, most importantly, that will help you
          build a good reputation and a loyal customer base. But, before you
          decide what foods you are going to sell, you will have to consider:
          The PROs and CONs of a Food Cart Business.
        </p>
        <p>
          There are many advantages to starting your own food cart business,
          which is why a lot of people choose to do just that. The PROs include:
        </p>
        <ul>
          <li>Low start-up costs</li>
          <li>Less risky than opening up a restaurant</li>
          <li>The ability to be your own boss</li>
          <li>The flexibility to work when and where you want</li>
          <li>Little restaurant experience required</li>
          <li>The growing popularity of the street food trend</li>
        </ul>
        <p>
          But, as with all business endeavors, there are also CONs to examine. A
          food cart business is no walk in the park: there is a lot of hard work
          to be done and you will only see significant profits after your
          business picks up.
        </p>
        <p>The biggest CONs are:</p>
        <ul>
          <li>Being self-employed can be testing for some</li>
          <li>Long hours, early mornings and night shifts required</li>
          <li>Fierce competition</li>
          <li>There are many regulations and laws to comply with</li>
          <li>Seasonal reliance</li>
          <li>Finding a suitable location that you are allowed to trade in</li>
          <li>Customer service can be challenging if you are a solo-primeur</li>
        </ul>
        <p>
          From our experience as food carts manufacturers, people are attracted
          by affordable start-up costs and by flexibility; at the same time, the
          most common complaints-at least in the initial phase-are long working
          hours and industry volatility in terms of trends and business
          opportunities. However, if you are passionate about good food and you
          start with solid and well-researched plan, there is every chance you
          could make a roaring success of your food cart start-up.
        </p>
        <h3>Step 1: Market Research</h3>
        <p>
          Market research involves finding out the who, what, where, why and
          when of your business, and while it is not the most exciting part of
          your endeavor, it is certainly an essential one. It can be risky and
          even silly to assume that you already know the answers to these
          questions and then get caught out later on.
        </p>
        <p>Here is what you need to address at this stage:</p>
        <h4>Operational</h4>
        <ul>
          <li>Where will you set up your food cart business?</li>
          <li>When will you open to ensure the best business?</li>
          <li>How will the weather affect your trade?</li>
        </ul>
        <h4>Target Market</h4>
        <ul>
          <li>Who are your customers? What is their demographic?</li>
        </ul>
        <h4>Competition</h4>
        <ul>
          <li>Is there any competition? What do they offer? </li>
        </ul>
        <h3>Locations and Business Opportunities</h3>
        <p>
          Finding a couple of great locations will play a major factor in your
          success and it depends on several key factors:
        </p>
        <ul>
          <li>Where you are allowed to park by law</li>
          <li>Where the customers are</li>
          <li>The prime hours for each location</li>
          <li>Competition</li>
        </ul>
        <p>Some great places and opportunities to consider for trading are:</p>
        <ul>
          <li>Office parks</li>
          <li>The business districts</li>
          <li>Empty lots</li>
          <li>Shopping districts or malls</li>
          <li>Popular tourist locations</li>
          <li>Sports venues</li>
          <li>Parks and beaches</li>
          <li>Bus and train stations</li>
          <li>College campuses</li>
          <li>Festivals and events</li>
          <li>Conferences and conventions</li>
          <li>Private events such as weddings, birthdays and so on</li>
          <li>Corporate events</li>
        </ul>
        <p>
          Most of these locations will require permits and/or owner agreements,
          so make sure to check with your local authorities and institutions
          beforehand. When it comes to festivals, events, conferences and
          conventions the best thing to do is to get in touch with organizers
          and lease your space well in advance.
        </p>
        <h3>Step 2: Determining Your Food Cart Business Legal Requirements</h3>
        <p>
          You have probably noticed that most How-To guides on this subject
          place sorting out the legal requirements at the bottom of their To-Do
          list.And here is why: the permits and licensing requirements for food
          cart businesses vary from country to country, state to state, and even
          city to city, so making a definitive list with everything you need is
          close to impossible.Only your local Health Department can provide you
          with the information that applies in your case.
        </p>
        <p>At this stage, you will address issues such as:</p>
        <ul>
          <li>The street food vending regulations in your city</li>
          <li>Licenses and permits required</li>
          <li>
            The types of food you will be selling and how they are handled,
            stored, thawed, and cooked
          </li>
          <li>
            Commissary requirements-the requirement to operate from a licensed
            commercial kitchen
          </li>
          <li>The size, make and the equipment of your street food vehicle</li>
          <li>The vehicle is fresh water and wastewater holding capacity</li>
          <li>Safe food handling course requirement</li>
          <li>Hygiene policies</li>
          <li>Pre-approval inspection of the equipment</li>
        </ul>
        <p>
          Most municipalities do not allow food vendors to operate a food cart
          business from a residential kitchen and they require the use of a
          commissary-a licensed and inspected commercial kitchen. Vendors have
          to report to the commissary each day of operation to prepare the food
          that will be served from the cart and to clean the vehicles equipment
          at the end of the day. If you are selling prepackaged foods, you are
          not considered a food handler and may have less stringent requirements
          than if you are actually preparing foods or even scooping ice cream.
          But as long as food is unwrapped, you are typically considered to be a
          food handler and must meet specific regulations.While your cart or
          truck manufacturer will not know the nuances of each citys
          requirements, they can usually help you meet specific health
          standards. For example, all of our food carts are manufactured using
          food-grade materials for countertops and other parts/areas where food
          may be stored and prepared.In addition, we work closely with each of
          our clients to adapt the carts cooking and water systems so they will
          meet all the health and safety standards specific to the vendors
          area.Getting all the trading, health and safety qualifications in
          order will not only allow you to operate legally and avoid hefty
          fines, but it will also help enforce the publics hard-earned
          perception that that those running a street food business are doing
          their utmost to meet and surpass sanitary requirements. Basically,
          your legal status and reputation are on the line.
        </p>
        <p>
          In addition to the food service permits and health requirements, you
          may also need to apply for:
        </p>
        <ul>
          <li>Business license</li>
          <li>State sales tax permit</li>
          <li>Truck/cart registration</li>
        </ul>
        <p>
          To sort these out, the city hall or the county clerks office will
          usually point you in the right direction.Keep in mind that before you
          can hit the road, health inspectors will check your vehicle. Usually,
          they look for:
        </p>
        <ul>
          <li>
            Proof of ownership, proper identification and license of the vehicle
          </li>
          <li>Proof of District-issued Food Manager Identification Card</li>
          <li>Food-purchase record storage and record keeping</li>
          <li>
            That your depot, commissary or service support facility meets your
            vending unit operation needs
          </li>
          <li>
            Copy of license for the service support facility and/or a recent
            inspection report
          </li>
        </ul>
        <p>
          Food vehicles are typically inspected at least once a year by a health
          department inspector, sometimes randomly.The inspector checks to see
          how food is stored so that it does not spoil and that it is kept at
          the proper temperature. All food equipment as well as sinks and water
          supplies are checked.Commercial kitchens and garages in which food
          vehicles are kept are also inspected frequently and can be given high
          fines if they do not meet health and fire codes. Some have been shut
          down because of too many violations. Likewise, trucks and carts have
          lost their licenses over repeated violations.
        </p>
        <h3>Step 3: Choosing Your Street Food Business Platform/Vehicle</h3>
        <p>
          Mobile street food businesses come in a variety of shapes and sizes,
          and deciding which is the right one for you depends on your:
        </p>
        <ul>
          <li>Start-up budget</li>
          <li>Time commitment</li>
          <li>Vision and the ability to fulfill it</li>
          <li>Experience at running a business</li>
          <li>Target demographic</li>
        </ul>
        <p>
          Your options are food stands, food carts, concession trailers and food
          trucks. Each of them has its own unique benefits as well as some
          disadvantages:
        </p>
        <h4>Food Stands</h4>
        <p>
          Food stands are essentially booths or stalls that are either temporary
          or mobile are used to sell everything from quick snacks such as
          bagels, pretzels, and ice cream, to more elaborate meals. Most food
          stands are usually operated indoors, and they are an excellent choice
          in areas where outdoor selling is limited by cold or unpleasant
          weather.
        </p>
        <p>Pros: low start-up and running costs, flexibility.</p>
        <p>Cons: limited trading areas, limited inventory.</p>
        <h4>Food Carts</h4>
        <p>
          Food carts have been around for decades, and they are one of the most
          cost-effective ways to start a mobile food business.
        </p>
        <p>
          Pros: affordable, easy to customize, easy to move between locations,
          easy to park, easy to maintain, suitable for both indoor and outdoor
          use, may require less licensing than a food truck.
        </p>
        <p>Cons: not too much space for preparing elaborate dishes.</p>
        <h4>Concession Trailers</h4>
        <p>
          Same as food carts, concession trailers have been around for a long
          time and are often found at fairs, carnivals and sporting events.
        </p>
        <p>
          Pros: low overhead costs compared to food trucks, more space for
          cooking.
        </p>
        <p>
          Cons: more difficult to move between locations, require bigger parking
          space both on/off-duty, involve higher operating costs.
        </p>
        <h4>Food Trucks</h4>
        <p>
          Very popular among seasoned street food vendors, food trucks can carry
          more food and handle more business than vending carts and concession
          trailers, but they also involve much higher start-up and running
          costs.
        </p>
        <p>
          Pros: more room for cooking and storing food which allows for more
          items on the menu, higher profits, increased mobility.
        </p>
        <p>
          Cons: high start-up and running costs, require more maintenance than
          food carts, bigger parking space both on/off-duty, more licensing than
          a food cart.
        </p>
        <h3>Step 4: Choosing Your Concept, Menu and Suppliers</h3>
        <p>
          Today, most street food vendors do not actually sell food-they sell a
          concept.
        </p>
        <p>
          Whether they are food carts, concession trailers or food trucks, most
          successful street food businesses out there have themes or concepts
          that are consistently reflected in all their elements: exterior
          design, branding, menus and recipes.Your concept should be a means of
          distinguishing you from your competition and building your niche
          market. And, if you get it right, it can even draw media attention to
          your business.This brings us to menu planning. Choosing what kind of
          food you willl prepare and sell can be a fun task, and if you look at
          the carts, trailers and trucks operating on the streets, you will find
          that almost anything edible can be served as street food.
        </p>
        <p>
          But there are a lot of factors to consider when it comes to menu
          planning, such as:
        </p>
        <ul>
          <li>What foods do you know how to cook?</li>
          <li>What foods do you enjoy cooking?</li>
          <li>What are the most popular foods in your area?</li>
          <li>
            What foods can you prepare relatively fast, repeatedly and without
            difficulty?
          </li>
          <li>What foods could your customers take with them easily?</li>
          <li>What foods have a good profit margin?</li>
          <li>What times of day will you be open for business?</li>
          <li>What are you going to specialize in?</li>
          <li>How many items will your menu have?</li>
          <li>Where are you going to get the ingredients from?</li>
        </ul>
        <p>
          After deciding on the type of food you are going to sell, it is time
          to start working on recipes and experiment with various ingredients.
          Once you have found a few favorites, test them on your friends and
          family first. Do not be afraid or dismissive of criticism: it is
          better to receive it from them. The bottom line is, do not start out
          with foods you have not thoroughly tested. This means you need to
          perfect each recipe to be sure it has the following qualities:
        </p>
        <ul>
          <li>It tastes consistently good</li>
          <li>It is easy to make repeatedly in large quantities.</li>
          <li>It is easy to serve</li>
          <li>It is easy to store and carry</li>
        </ul>
        <p>
          Next in line is figuring out your sourcing-where will you buy your
          ingredients from?
        </p>
        <p>
          Sourcing your food can be an important factor in planning your
          purchases, schedule and menu items. Common sources include wholesale
          food distributors, food manufacturers, local and regional suppliers,
          green markets and farmers markets.Determining the right quantities is
          another matter that you will need to deal with, initially by trial and
          error. If you have the time, spend a couple of hours observing the
          street food vendors in your area. How many customers do they have per
          hour? When is their busiest period? This will help you estimate a
          potential sales volume, which you can use to draft your shopping list.
          Pay special attention to foods and ingredients that lose their
          freshness quickly; learn which are the items you can safely keep
          throughout the day and how many of them you can sell before they go
          bad.{" "}
        </p>
        <h3>Step 5: Creating Your Food Cart Business Plan</h3>
        <p>
          Despite the low start-up costs involved, jumping into street food
          without any kind of plan is a sure-fire recipe for disaster. The space
          is extremely competitive, and you need to have a very clear idea of
          the niche you plan to fill before taking the plunge.Writing a business
          plan is not a complicated job and it does not have to be very long.
          Keep it concise, to the point and ensure that you cover each of the
          following topics:
        </p>
        <ul>
          <li>Your business name</li>
          <li>Business management: who is going to be in charge?</li>
          <li>
            Your mission statement: in one sentence, summarize the aim of your
            street food business.
          </li>
          <li>
            Your vehicle: are you going to use a stall, a cart, a trailer or a
            truck?
          </li>
          <li>
            Start-up costs: what do you need to buy to get started? What fees to
            you need to pay in advance?
          </li>
          <li>
            The daily operational costs: how much will you spend on ingredients
            and what are the overhead costs on a weekly or monthly basis?
          </li>
          <li>
            Funding and financial projections; where do you plan to get the
            money from to start the business and what are your projected
            profits/losses for the next month, year, 2 years etc? How will you
            maintain the cash-flow?
          </li>
          <li>
            Your schedule: will you work on the business full-time or alongside
            your day job?
          </li>
          <li>
            What is your main competition and how will you differentiate
            yourself from it?
          </li>
          <li>What is your marketing strategy?</li>
          <li>
            Do you have the logistics in place to deal with delivery and
            customer service?
          </li>
        </ul>
        <p>
          If you plan to focus on events, your food cart business plan should
          include a clear targeting strategy. Pitch fees will vary widely, and
          there are a whole host of other variables to consider including total
          attendance, other traders present, and the demographic of customer
          that will attend.A good idea would be to create a spreadsheet with all
          the events and street food opportunities in your area. The number of
          options available could seem daunting in the beginning, so start by
          thinking about what kind of event or environment you would expect to
          see a street food business like yours.
        </p>
        <p>
          The next step would be to attend a few events yourself, taking note of
          the businesses that appear to be doing well and why.As a general
          guide, generic fast-food businesses that focus on sales volume fare
          well at large music festivals and other events where the food is
          incidental to the main experience, whilst high-end street food traders
          perform better at events in which the customer will be searching for a
          new taste experience. However, all the preparation in the world can
          not account for the unexpected, and you will find some events simply
          fail to produce the expected revenue. Your business plan should
          account for this, and you should always have enough spare cash in
          reserve to act as a safety net when you run up against the worst-case
          scenario.Your approach to branding and marketing is a vital part of
          your business plan. A strong brand will help you stand out from the
          crowd, which is important for attracting customers as well as for
          securing spots at venues.
        </p>
        <p>
          Remember: you are often selling a lifestyle with street food, so your
          brand should have a good slogan and a clear identity which reflects
          this.
        </p>
        <p>
          Social media should obviously be central to your marketing plan and a
          strong Facebook and Instagram presence will help you raise your
          profile and create an army of online followers who you can spread your
          message to.Regularly update your profiles with good quality photos as
          they generate a lot of interest and always display your social media
          handles so your customers /potential customers can connect with you
        </p>
        <h3>
          Step 6: Estimating Costs: How Much Does It Cost to Start and Run a
          Food Cart Business?
        </h3>
        <p>
          There is no set formula for determining how much starting a street
          food business is going to cost you since the niche is very broad and
          there are too many possibilities. But even so, if you were to
          estimate, here is a general expense breakdown:
        </p>
        <h4>Food Cart Business</h4>
        <ul>
          <li>$3,000 to $5000 on a fully equipped food cart</li>
          <li>$500 to $700 on your ingredients and initial food stock</li>
          <li>$400 to $ 600 on permits and registrations</li>
          <li>$500 and upwards on marketing</li>
          <li>$500 for the first month to park and clean the cart</li>
          <li>$500 in other miscellaneous costs</li>
        </ul>
        <h4>Food Truck Business:</h4>
        <ul>
          <li>$50,000 to $75,000 on a retrofitted food truck</li>
          <li>$1,000 to $1,500on initial ingredients</li>
          <li>$2,000 on permits and licenses</li>
          <li>$2,000 for the first month of a commercial kitchen rental</li>
          <li>$500 for the first month of parking and maintaining the truck</li>
          <li>$1,800 on kitchen supplies</li>
          <li>$3,000 on marketing and promotion</li>
          <li>$2,000 on packaging</li>
          <li>$500 in miscellaneous costs</li>
        </ul>
      </Container>
    </Container>
  );
}
