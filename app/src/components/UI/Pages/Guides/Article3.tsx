import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { Container, Header } from "semantic-ui-react";

export default function AddArticle3() {
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
      <Header as="h2">Food Truck Start Up Cost</Header>
      <p>
        The amount of work required to open a bricks and mortar restaurant of
        your own can be daunting, especially if you have no prior experience in
        the food industry. However, a food truck could be the perfect entry
        point into the world of catering. New food truck operators are opening
        businesses all the time, and the industry itself is currently worth an
        estimated $1.2 billion - so now could be the time to launch your new
        venture.
      </p>
      <p>
        To help make your food dreams a reality, we're taking an in-depth look
        at the costs involved with starting a food truck.
      </p>
      <h3>Writing a business plan</h3>
      <p>
        More often than not, money is the main thing holding entrepreneurs back
        from following their ambitions. As a new business owner, the first step
        in is to write a business plan. This should focus on your financial
        forecasting, covering your initial funding requirements, a close look at
        the predicted food truck costs and how you believe your business will
        grow in its first few years. The more research you do in the initial
        stages and the more thorough your research is, the easier it should be
        for you to get your business up and running. You can get a better idea
        of how much money you'll need to start your food truck business by using
        our custom startup cost calculator
      </p>
      <p>
        please note these costs are indicative, and you can alter the figures
        for your own requirements.
      </p>
      <h3>Resources and equipment</h3>
      <p>
        Your main expense will be the food truck itself - prices range
        considerably when it comes to buying one of these specialist vehicles.
        At the low end of the scale, you could be looking at spending around
        $50,000, however, prices can go a lot higher for a new food truck,
        especially ones which are fully equipped and decorated.
      </p>
      <p>Other costs you'll need to factor in include:</p>
      <ul>
        <li>Insurance - $2,000 to $4,000 per year</li>
        <li>Initial food costs and inventory - $1,000 to $2,000</li>
        <li>Uniforms - $0 to $1,000</li>
        <li>Paper products such as napkins, plates and so on- $200 to $300</li>
        <li>Website - $0 to $5,000</li>
      </ul>
      <h3>Hiring a team and finding vendors</h3>
      <p>
        One of the benefits of owning your own food truck is that they only need
        a couple of people to make them work. So, if you're planning on working
        in the truck yourself, you'll only need one, or possibly two, employees.
        The average wages you can expect to pay your staff will vary from state
        to state:
      </p>
      <ul>
        <li>minimum wage in Washington state - $14.49 per hour</li>
        <li>
          Average wage for a food truck manager in Washington state - $28.56 per
          hour
        </li>
      </ul>
      <p>
        As well as staff, you'll need to source reliable vendors if your food
        truck startup is going to be a success. When looking at the price of
        ingredients, remember that you'll be marking up by around 300%, so you
        will need to think about your profit and loss here.
      </p>
      <h3>Getting your paperwork in order</h3>
      <p>
        Paperwork is an important part of launching any new business. Even
        though your food truck will be mobile, you'll still need a number of
        permits and licenses before you can begin trading. These include:
      </p>
      <ul>
        <li>Employer Identification Number</li>
        <li>Business License</li>
        <li>Vehicle License</li>
        <li>Seller's Permit-some states only</li>
        <li>Food Safety/Food Handler's Permit</li>
        <li>Health Department Permit</li>
        <li>Fire Certificate</li>
      </ul>
      <h3>Choosing the right payment solution for your business</h3>
      <p>
        In general, consumers who use food trucks want to be served as quickly
        as possible. Most customers will also appreciate the ability to pay
        using a variety of methods. This means you'll need to invest in a
        point-of-sale system that can process payments quickly and efficiently,
        and that accepts all common payment methods.The cost of your POS system
        will vary depending on the package you choose. While some providers ask
        for a flat fee, others optimize each transaction based on a variety of
        factors.
      </p>
      <h3>Invest in marketing</h3>
      <p>
        Although a lot of entrepreneurs invest heavily in marketing, there are a
        lot of ways to keep these costs down. Many food truck owners make use of
        social media which can be an incredibly effective marketing tool, and a
        fantastic way to get your brand name out there and bring people to your
        business.
      </p>
      <p>These are just a few ways to attract customers:</p>
      <ul>
        <li>Post menu items and appetizing content</li>
        <li>Free or inexpensive advertisements</li>
        <li>Offer incentives / discount codes to connect with you</li>
        <li>Partner up with other food trucks in your area</li>
      </ul>
      <h3>Food truck stats</h3>
      <p>
        Between 2007 and 2012, the food truck industry grew at an average rate
        of 8.4% per year. In general, it costs between $28,000 and $114,000 to
        get a food truck business up and running, with the average food truck
        earning around $300,000 per year.Starting your own business is
        incredibly rewarding, especially if it's a success. The most important
        part of starting any new business is getting your financial forecasting
        right. Make sure your costs breakdown is as accurate as possible to
        ensure there are no surprises along the way.
      </p>
    </Container>
  );
}
