const {
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = require("../config/s3");

const uploadArtifact = async (
  deploymentId,
  version
) => {

  console.log("UPLOAD FUNCTION CALLED");

  try {

    const artifactName =
      `${version}.zip`;

    console.log(
      "Uploading:",
      artifactName
    );

    const fakeBuildContent =
      `Fake deployment artifact for ${version}`;

    const result =
      await s3Client.send(
        new PutObjectCommand({
          Bucket:
            "progressive-delivery-artifacts",

          Key: artifactName,

          Body: fakeBuildContent,

          ContentType:
            "application/zip",
        })
      );

    console.log(
      "UPLOAD SUCCESS"
    );

    console.log(result);

    return `https://progressive-delivery-artifacts.s3.ap-south-1.amazonaws.com/${artifactName}`;

  } catch (error) {

    console.log(
      "UPLOAD FAILED"
    );

    console.error(error);

    throw error;
  }
};

module.exports = {
  uploadArtifact,
};