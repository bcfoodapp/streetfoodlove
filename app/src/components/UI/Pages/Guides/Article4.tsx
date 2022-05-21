import { Container, Header } from "semantic-ui-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
import Buttons from "../../Atoms/Button/Buttons";

export default function AddArticle4() {
  const divToPrint = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  function printDocument() {
    setDownloading(true);
    html2canvas(divToPrint.current!)
      .then(function (canvas) {
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
        doc.save("How-to-Start-an-Ice-Cream-Cart-Business.pdf");
      })
      .then(() => {
        setDownloading(false);
      });
  }

  return (
    <Container>
      <Container>
        {downloading ? (
          <Buttons color={"green"} downloadPdf loading>
            Download as PDF
          </Buttons>
        ) : (
          <Buttons clicked={() => printDocument()} color={"green"} downloadPdf>
            Download as PDF
          </Buttons>
        )}
      </Container>
      <div ref={divToPrint}>
        <Header as="h2">How to Start an Ice Cream Cart Business</Header>
        <p>
          Did you know that the average American consumes 22 lbs of ice cream
          every year?
        </p>
        <p>
          In fact, the ice cream demand is so great, the ice cream industry
          produces more than 870 million gallons of it every year, generating
          over $5 billion in 2014 alone. However, before you run off to start
          your own mobile ice cream shop, you need to understand several
          important aspects that are specific to this niche. Hopefully, by the
          time you finish reading this post, you'll have a clear idea of exactly
          what you need to do in order to turn your appreciation of ice cream
          into a fresh source of monthly income.
        </p>
        <h3>Things to Consider: Challenges and Hidden Opportunities</h3>
        <p>
          As with any vending business, an ice cream cart venture has its
          specific challenges and opportunities and it's entirely up to you to
          make them work in your favor.For example, the greatest challenges ice
          cream carts owners face are the ones related to their local council's
          street food regulations that usually address the vending carts
          equipment and the trading locations. At the same time, seasonal
          limitations should also be considered: if you live in an area where
          the weather tends to be drafty and wet most of the time, selling ice
          cream outdoor would be a challenge, to say the least. Add to that the
          convenience of supermarket shopping and you get the full picture of an
          ice cream cart business' limitations.However, the "when one door
          closes, another one opens" adage successfully applies in this case:
          many ice cream cart vendors work around these restrictions by catering
          to fairs, private events, and parties. And, according to our
          customers, one of the most lucrative sub-niches is renting the ice
          cream cart to weddings and birthday parties.Other advantages of an ice
          cream cart business are low start-up costs, excellent profit margins,
          minimal waste, and little skill required-unless you prepare the ice
          cream yourself.
        </p>
        <h3>Find Out the Legal Requirements of an Ice Cream Cart Business</h3>
        <p>
          Thorough research and planning will help tremendously, especially
          since legislation concerning street food vending varies from one
          country to another and even from one city to another.The legal
          requirements don't only determine what and where you're allowed to
          sell; they also determine your vending cart's equipment. We often
          adapt our carts, including ice cream vending carts, to fulfill
          regulations concerning hot and cold-water supply, waste disposal, and
          so on.So, the first thing you should do is to contact your local
          Health Department or the Department of Environmental Services in your
          area and address the following issues:
        </p>
        <ul>
          <li>The street food vending regulations in your city.</li>
          <li>
            The types of food you'll be selling and how they're handled, stored,
            and served.
          </li>
          <li>
            Commissary requirements-the requirement to operate from a licensed
            commercial kitchen *.
          </li>
          <li>
            The size, make and the equipment of the ice cream vending cart.
          </li>
          <li>The cart's fresh water and wastewater holding capacity;</li>
          <li>Safe food handling course requirement.</li>
          <li>Hygiene policies.</li>
          <li>Pre-approval inspection of the equipment.</li>
        </ul>
        <p>
          * In the US, most municipalities don't allow street food vendors to
          operate a food service business from a residential kitchen and they
          require the use of a commissary-a licensed and inspected commercial
          kitchen. Vendors have to report to the commissary each day of
          operation to prepare the food that will be served from the cart and to
          clean the cart's equipment at the end of the day. However, since
          you'll be selling frozen desserts, check if this applies in your
          case.After learning about the health and safety requirements, you
          should the contact the Business License Department and find out what
          you need to obtain your business license. If you're planning to
          advertise on mobile billboards, you should also check if there's a
          limit on the maximum amount of signage you are allowed to use.
        </p>
        <h3>Legal Requirements, in short</h3>
        <p>
          Most of our customers said the requirements usually involve a health
          permit, a food handling permit, an ice cream vendor permit, a business
          license and insurance. You might also need a criminal background check
          before the permits can be issued to you
        </p>
        <h3>Research Target Market and Locations</h3>
        <ul>
          <li>Make a list with street vending locations</li>
          <p>
            Start by making a list of all the places with good vending potential
            in your area. The list should include neighborhoods occupied by
            families, parks, shopping centers, swimming pools, beaches, fairs
            and festival locations, and other places where children and adults
            frequently go.Remove those where street vending is restricted and
            highlight the ones that seem most attractive to you.
          </p>
          <li>Brainstorm catering opportunities</li>
          <p>
            After refining the first list, make a second one that addresses
            catering to private events and parties. An ice cream vending cart
            can be the center of attention at company picnics, community
            get-togethers, fairs, festivals, parades, fundraisers, birthday
            parties, engagement parties, weddings and more. The idea of having
            soft-serve ice cream desserts at private celebrations and social
            events is a huge hit with the customers, and the best part is that
            parties always lead to more parties. Virtually every event you'll
            attend could bring in future business, but this also means you'll
            have to rise up to the occasion and be the best in what you do!
          </p>
        </ul>
        <h3>Research Your Competition</h3>
        <p>
          As a first-time entrepreneur, you should thoroughly research all the
          aspects of your future business and sizing up your competition is a
          crucial part of this stage. Who else sells ice cream in your area?
          Visit each one of them and observe how they're operating their
          business. Pay attention to things such as:
        </p>
        <ul>
          <li>Vendor's attitude.</li>
          <li>What are they doing right?</li>
          <li>What are they doing wrong?</li>
          <li>What are the things you could do better?</li>
          <li>What kinds of ice cream, toppings, and sides they're selling?</li>
          <li>Unique flavors and combinations?</li>
          <li>Best-selling products.</li>
          <li>Particular customer preferences.</li>
          <li>Marketing and branding.</li>
        </ul>
        <p>
          Write all these things down as they will help you create your menu,
          your pricing structure, and your marketing strategy.
        </p>
        <h3>Create Your Ice Cream Cart Business Plan</h3>
        <p>
          This step is all about planning, since you can't start and operate a
          successful business without a good business plan. Writing it down will
          give you a clear direction and keep you from making costly financial
          mistakes, especially in the beginning.
        </p>
        <p>Your business plan should cover:</p>
        <ul>
          <li>Budget</li>
          <li>Legal expenses for obtaining licenses and permits</li>
          <li>Ice Cream Vending Cart price</li>
          <li>Insurance</li>
          <li>Operational cost for the first 1-2 month</li>
          <li>Initial stock costs-1-2 months;</li>
          <li>
            Incidental costs: napkins, plasticware, to-go containers, etc;
          </li>
          <li>Marketing and advertising expenses.</li>
          <li>Marketing Strategy and Sales Strategy</li>
        </ul>
        <p>How do you plan to market and advertise your business? You could:</p>
        <ul>
          <li>
            Throw opening party to let locals know you're open for business
          </li>
          <li>Engage in community events to sell your products</li>
          <li>Advertise your products in your local media</li>
          <li>List your business on local and online directories</li>
          <li>Create a landing page for your business</li>
          <li>Leverage the power of social media</li>
          <li>Engage in direct marketing and sales</li>
          <li>Encourage the use of Word-of-Mouth marketing referrals</li>
        </ul>
        <h3>Things to Consider</h3>
        <ul>
          <li>
            Decide what you want to sell: high-end, artisanal ice-cream, frozen
            yogurts, popsicles, or any other variation of ice cream products.
            Write down all your ideas and then pick one that most excites you.
          </li>
          <li>
            Picking one or two products as your specialty matters more than you
            think. If you try being all things to all people, you may have the
            opportunity to draw in more customers, but you'll also have to stock
            accordingly.
          </li>
          <li>
            Make sure people know where to find you if you move around often.
            You could use Facebook and Twitter to tell customers where you are.
            You can also do this on your website if you decided to have one.
          </li>
          <li>
            Learn to upsell. If a customer orders a scoop of ice cream, ask if
            she would like to make it a double or if she would like sprinkles
            and a cherry.
          </li>
          <li>
            Have popular flavors on hand, and even unusual ones, such as
            jalapeno apricot. Vanilla is the most popular ice cream flavor,
            followed by chocolate chip mint and cookies and cream.
          </li>
          <li>
            Stay open on days you're likely to garner more sales, such as Sunday
            and Monday.Cold Stone Creamery reports that Sunday is the most
            popular day for ice cream sales. According to Mashable, food trucks
            are busiest on Mondays.
          </li>
          <li>
            Brand yourself! Find a catchy name and decide on a style that will
            reflect your business and its personality. Branding also means
            consistency, so make sure that all your promotional materials,
            design, and copywriting wise, stay true to your identity and brand
            message!
          </li>
        </ul>
      </div>
    </Container>
  );
}
