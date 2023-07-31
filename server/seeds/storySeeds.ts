import { Story, Pages, Artwork } from '../database/index.js';


const createSeedData = async () => {
  try {

    const artwork = await Artwork.create({ type: 'book', userId: 'fakeId' });
    const { id: artworkId } = artwork.dataValues;

    //find if the story exists
    let story = await Story.findOne({ where: { title: 'Instructions' } });

    // If the story does not exist, create it
    if (!story) {
      story = await Story.create({
        artworkId,
        title: 'Instructions',
        coverImage: 'https://res.cloudinary.com/dhin8tgv1/image/upload/v1689102895/ifjlfroavjrpigqbzyrm.webp',
        titleColor: '#000000',
        originalCreatorId: "google-oauth2|108908358062767655933",
        numberOfPages: 3,
        isPrivate: false,
        collaborators: [],
      });
      const pagesData = [
        {
          page_number: 1,
          content: 'There are several different features designed to help craft a story. From the create a new story button above, you can add a title, a cover image, and set the story as private or public (default). The title color can be adjusted using the magic wand on the tool bar above. This will allow you to customize your title text for your cover image. The cover image cannot be changed once it is set so be careful to verify you have the correct image in the drag and drop area.',
          storyId: story.getDataValue('id'),
        },
        {
          page_number: 2,
          content: 'An important feature is the page editor, designed to assist with writing a story. Click on a page to open the page editor. From there, you will see options to save text to the page, clear the content of the page editor, read the content of the page editor, and speech-to-text. Additionally, there is a Grammarly assistant that will help with grammar and spelling suggestions. So you can worry less about mistakes and more about writing.',
          storyId: story.getDataValue('id'),
        },
        {
          page_number: 3,
          content: 'Invite your friends to come write a story with you. You can edit the story in the page editor together and talk about your ideas in the shared room. Check out some of our awesome public stories below if you are looking for inspiration. Otherwise, have fun and happy writing!',
          storyId: story.getDataValue('id'),
        },
      ];
      await Pages.bulkCreate(pagesData);
    }

    console.log('Seed data created successfully!');
  } catch (error) {
    console.error('Error creating seed data:', error);
  }
};








export default createSeedData;